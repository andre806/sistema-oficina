import { BOOLEAN } from "./convex-types.js"

export interface response{
    sucess:boolean | BOOLEAN
    message?:string
    content?:any
}