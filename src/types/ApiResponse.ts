import { MessageI } from "@/models/user.model";

export interface ApiResponse {

    success: boolean,
    message: string,
    messages?: MessageI[],
    isAcceptingMessage?: boolean

}