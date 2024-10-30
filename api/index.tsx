import axios, { AxiosRequestConfig } from "axios"


const domain = 'https://gateway.tandemworkflow.com/api/v1'
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
        return (await axios.post(domain + '/auth/google-auth', {}, config)).data
    },
    SignUp : async (payload, config: AxiosRequestConfig): Promise<VerifyResponse> => {
        return (await axios.post(domain + '/auth/register', payload, config)).data
    },
    LogIn : async (payload, config: AxiosRequestConfig): Promise<VerifyResponse> => {
        return (await axios.post(domain + '/auth/login', payload, config)).data
    }
}

const RentalAPI = {
    GetVehicles : async (config: AxiosRequestConfig): Promise<RentalItem[]> => {
        const response = await axios.get(domain + '/rental/vehicles', config)
        return response.data
    },
    GetRentalHistory : async (config: AxiosRequestConfig): Promise<RentalItem[]> => {
        const response = await axios.get(domain + `/rental/rentals`, config)

        return response.data
    },
    GetVehicleByType: async (type:string, config: AxiosRequestConfig): Promise<RentalItem[]> => {
        const response = await axios.get(domain + `/rental/vehicles/${type}`, config)
        return response.data
    },
    GetVehicleByStation: async (station:string, config: AxiosRequestConfig): Promise<RentalItem[]> => {
        const response = await axios.get(domain + `/rental/station/${station}`, config)
        return response.data
    },
    GetRentalStations: async (config:AxiosRequestConfig) => {
        const response = await axios.get(domain + `/navigation/rental`, config)
        return response.data
    },
    CreateRentalObject:async (payload, config:AxiosRequestConfig) => {
        const response = await axios.post(domain + '/rental/rentals/add',payload, config)
        return response.data
    },
    GetStationVehicles:async (station, config:AxiosRequestConfig) => {
        const response = await axios.get(domain + `/rental/station/${station}`, config)
        return response.data
    }
}

const Schedules = {
    GetSchedules : async (config: AxiosRequestConfig): Promise<any> => {
        return (await axios.get(domain + '/bus-schedule/live-schedule', config)).data
    },
    GetRoutes : async (config: AxiosRequestConfig): Promise<any> => {
        return (await axios.get(domain + '/bus-schedule/routenames', config)).data
    },
    GetRoutedetails : async (config: AxiosRequestConfig): Promise<any> => {
        return (await axios.get(domain + '/bus-schedule/allroutes', config)).data
    },
    Getsubscription : async (config: AxiosRequestConfig): Promise<any> => {
        return (await axios.get(domain + '/bus-schedule/listsub', config)).data
    },
    CreatesubscriptionObject:async (payload,config:AxiosRequestConfig) => {
        const response = await axios.post(domain + '/bus-schedule/addsub',payload, config)
        return response.data
    },
    RemovesubscriptionObject:async (payload,config:AxiosRequestConfig) => {
        const response = await axios.post(domain + '/bus-schedule/removesub',payload, config)
        return response.data
    },
}

type AuthType = {
    Verify: typeof Auth.Verify;
    SignUp: typeof Auth.SignUp;
    LogIn: typeof Auth.LogIn
}

interface ScheduleType {
    GetSchedules: typeof Schedules.GetSchedules;
    GetRoutes: typeof Schedules.GetRoutes
}

interface RentalType {
    GetVehicles: typeof RentalAPI.GetVehicles;
    GetVehicleByType: typeof RentalAPI.GetVehicleByType;
    GetRentalStations: typeof RentalAPI.GetRentalStations;
    CreateRentalObject: typeof RentalAPI.CreateRentalObject;
    GetStationVehicles: typeof RentalAPI.GetStationVehicles
    
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