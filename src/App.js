import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkFrom from './components/ImageLinkFrom/ImageLinkFrom';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg'
import { Component } from 'react';


const initialState = {
    input: '',
    imageUrl: '',
    boxes: [],
    route: 'signin',
    isSignIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
            }
        })
    }

    calculateFacesLocation = (data) => {
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);

        const boxes = data.outputs[0].data.regions;
        return boxes.map(box => {
            const clarifaiFace = box.region_info.bounding_box;
            return {
                left_col: width * clarifaiFace.left_col,
                top_row: height * clarifaiFace.top_row,
                right_col: width - (clarifaiFace.right_col * width),
                bottom_row: height - (clarifaiFace.bottom_row * height)
                }
            }
        )
    }

    displayFacesBox = (boxes) => {
        this.setState({ boxes: boxes});
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value});
        this.setState({boxes: []});
    }

    onImageSubmit = () => {
        this.setState({ imageUrl: this.state.input });

        fetch('https://face-recognition-server-2na4.onrender.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ input: this.state.input })
            })
        .then(response => response.json())
        .then(result => {
            if (Object.keys(result.outputs[0].data).length > 0){ // found a face in the image
                fetch('https://face-recognition-server-2na4.onrender.com/image', {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: this.state.user.id
                    })
                })
                .then(response => response.json())
                .then(count => {
                    this.setState(Object.assign(this.state.user, {entries: count}));
                })
                .catch(console.log)

                this.displayFacesBox(this.calculateFacesLocation(result));
            }
        })
        .catch(error => console.log('error', error));   
    }


    onRouteChange = (route) => {
        if (route === 'signout'){
            this.setState(initialState);
        }
        else if (route === 'home'){
            this.setState({isSignIn: true});
        }
        this.setState({route: route});
    }


    render() {
        const  { isSignIn, input, boxes, route} = this.state
        return (
            <div className="App">
                <ParticlesBg className='particles' type="cobweb" bg={true} num={120} color="#e0e0e0" />
                <Navigation isSignIn={isSignIn} onRouteChange={this.onRouteChange}/>
                { route === 'home'
                    ?   <div>
                            <Logo />
                            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                            <ImageLinkFrom
                                onInputChange={this.onInputChange}
                                onImageSubmit={this.onImageSubmit}
                            />
                            <FaceRecognition boxes={boxes} imageUrl={input}/>
                        </div>
                    
                    :   (
                        route === 'signin'
                        ?   <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                        :   <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    )
                }
            </div>
        );
    }
}

export default App;
