import { Router } from "express"
import resortAdminController from "../controllers/resortAdminController"
import adminController from "../controllers/adminController"
import { resortProtect } from "../middleware/auth"
import bookingController from "../controllers/bookingController"
import messageContoller from "../controllers/messageContoller"


const resortAdminRouter = Router()

resortAdminRouter.post('/register', resortAdminController.register)
resortAdminRouter.post('/signin', resortAdminController.signin)
resortAdminRouter.post('/signout', resortProtect, resortAdminController.signout)

resortAdminRouter.get('/categories', adminController.listCategories)
resortAdminRouter.get('/facilities', adminController.listFacilities)

resortAdminRouter.get('/myresort/:id', resortProtect, resortAdminController.getMyResort)
resortAdminRouter.put('/myresort/:id', resortProtect, resortAdminController.editResort)

resortAdminRouter.get('/rooms/:resortId', resortProtect, resortAdminController.getRoomsByResortId)
resortAdminRouter.get('/rooms/detail/:id', resortProtect, resortAdminController.getRoomsById)
resortAdminRouter.post('/rooms', resortProtect, resortAdminController.addRoom)
resortAdminRouter.put('/rooms/:id', resortProtect, resortAdminController.editRoom)
resortAdminRouter.patch('/rooms/:id/delete', resortProtect, resortAdminController.deleteRoom)

resortAdminRouter.get('/bookings/:resortId', resortProtect, bookingController.getBookingsByResortId)
resortAdminRouter.patch('/bookings/:id', resortProtect, bookingController.updateBookingStatus)

resortAdminRouter.get('/dashboard/:id', resortProtect, resortAdminController.getChartDetails)
resortAdminRouter.get('/dashboard/tails/:id', resortProtect, resortAdminController.getTailsDetails)

resortAdminRouter.get('/messages/receivers', resortProtect, messageContoller.getReceivers)
resortAdminRouter.get('/messages/:id', resortProtect, messageContoller.getMessages)
resortAdminRouter.post('/messages', resortProtect, messageContoller.sendMessage)




export default resortAdminRouter