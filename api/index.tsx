import axios, { AxiosRequestConfig } from "axios"


const domain = 'http://ec2-52-40-184-137.us-west-2.compute.amazonaws.com'
const testDomain = 'http://localhost:3000'


const Auth = {
    Verify : (config: AxiosRequestConfig) => {
        return axios.post(domain + '/api/v1/auth/google-auth', {}, config)
    }
}

type AuthType = {
    Verify: typeof Auth.Verify
}

type V1Type = {
    Auth: AuthType
 }

type APIType = {
    V1: V1Type
}




const API: APIType = {
    V1:{
        Auth
    }
}


export default API