import React, { Component } from 'react';
import appConfig from "./appConfig"

class AuthService extends Component {
/*     constructor(props) {
        super(props);
    } */

    render() {
        console.log(appConfig.AppId);
        return (
            <div className="authService">
                <p>
                    <a href={"https://api.pinterest.com/oauth/?response_type=code&redirect_uri=" + appConfig.RedirectURI + 
                                "&client_id=" + appConfig.AppId + 
                                "&scope="+ appConfig.AppScope + 
                                "&state=nbm072517"
                                }>
                                Log In to Pintrest
                                </a>
                </p>
            </div>
        );
    }
}

export default AuthService;