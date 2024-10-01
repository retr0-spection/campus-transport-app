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

const Schedules = {
    GetSchedules : async (config: AxiosRequestConfig): Promise<T> => {
        return (await axios.get(domain + '/api/v1/bus-schedule/liveschedule?time=08:00', config)).data
    },
    GetRoutes : async (config: AxiosRequestConfig): Promise<T> => {
        return (await axios.get(domain + '/api/v1/bus-schedule/routenames', config)).data
    }
}

type AuthType = {
    Verify: typeof Auth.Verify
}

interface ScheduleType {
    GetSchedules: typeof Schedules.GetSchedules;
    GetRoutes: typeof Schedules.GetRoutes
}

type V1Type = {
    Auth: AuthType;
    Schedules: ScheduleType
 }

type APIType = {
    V1: V1Type
}




const API: APIType = {
    V1:{
        Auth,
        Schedules
    }
}


export default API