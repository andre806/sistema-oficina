import { BOOLEAN } from "./convex-types"

export interface response{
    sucess:boolean | BOOLEAN
    message?:string
    content?:any
}