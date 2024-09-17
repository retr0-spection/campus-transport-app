import axios, { AxiosRequestConfig } from "axios"


const domain = 'http://ec2-52-40-184-137.us-west-2.compute.amazonaws.com'
const testDomain = 'http://localhost:3000'



interface VerifyResponse {
    message:string;
    token:string;
    refresh_token:string;
}

const Auth = {
    Verify : async (config: AxiosRequestConfig): Promise<VerifyResponse> => {
        return (await axios.post(domain + '/api/v1/auth/google-auth', {}, config)).data
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