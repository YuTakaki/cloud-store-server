import { Request, Response } from "express"

const sample = (req : Request, res: Response) => {
  console.log('he')
  res.send("Hello");
}

export default {
  sample,

}