// Importing required Modules
import {AsyncHandler} from '../../Utils/AsyncHandler.js'


export const HealthCheck = AsyncHandler(async (req, res) => {
    return res.status(200).json({
        message: 'Server is Runing Successfully',
        health : "Good",
        success: true
      })
})