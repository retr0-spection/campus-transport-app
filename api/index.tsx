import axios, { AxiosRequestConfig } from "axios"


const domain = 'https://gateway.tandemworkflow.com'
const testDomain = 'http://localhost:3000'



interface VerifyResponse {
    message:string;
    token:string;
    refresh_token:string;
    email:string
}

export interface RentalItem {
    id: string;
    name: string;
    image: any; // You would use a proper type for images in a real app
    available: boolean;
    units: number;
    route: string;
  }

const Auth = {
    Verify : async (config: AxiosRequestConfig): Promise<VerifyResponse> => {
        return (await axios.post(domain + '/api/v1/auth/google-auth', {}, config)).data
    }
}

const RentalAPI = {
    GetVehicles : async (config: AxiosRequestConfig): Promise<RentalItem[]> => {
        const response = await axios.get(domain + '/api/v1/rental/vehicles', config)

        return response.data
    },
    GetVehicleByType: async (type:string, config: AxiosRequestConfig): Promise<RentalItem[]> => {
        const response = await axios.get(domain + `/api/v1/rental/vehicles/${type}`, config)
        return response.data
    },
}

const Schedules = {
    GetSchedules : async (config: AxiosRequestConfig): Promise<any> => {
        return (await axios.get(domain + '/api/v1/bus-schedule/liveschedule?time=08:00', config)).data
    },
    GetRoutes : async (config: AxiosRequestConfig): Promise<any> => {
        return (await axios.get(domain + '/api/v1/bus-schedule/routenames', config)).data
    },
}

type AuthType = {
    Verify: typeof Auth.Verify
}

interface ScheduleType {
    GetSchedules: typeof Schedules.GetSchedules;
    GetRoutes: typeof Schedules.GetRoutes
}

interface RentalType {
    GetVehicles: typeof RentalAPI.GetVehicles;
    GetVehicleByType: typeof RentalAPI.GetVehicleByType;
}

type V1Type = {
    Auth: AuthType;
    Schedules: ScheduleType;
    Rental: RentalType
 }

type APIType = {
    V1: V1Type
}




const API: APIType = {
    V1:{
        Auth,
        Schedules,
        Rental:RentalAPI
    }
}


export default API