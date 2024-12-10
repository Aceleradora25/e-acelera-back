import router from "."
import  request  from "supertest"
import express from "express"


describe("Recuperar Status do Exercício", () => {
    const app = express()
    app.use(express.json())
    app.use(router)

    it("Get com topic inválido", async ()=> {   
        const response = await request(app).get('/topic/stepowerRanger/item/powerRangerAzul').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQGdtYWlsLmNvbSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTczMzg1NjM3MiwiZXhwIjoxNzMzODU5OTcyfQ.PAsjkK7sJNM-nN1ZX0-Up3tvkHiQmpGs1DRwQPmQ3e8')
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({
             message: "topicId invalid" 
          })
    })
    it("Get com itemId inválido", async ()=> {   
        const response = await request(app).get('/topic/rw17212367802520ba251/item/powerRangerAzul').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQGdtYWlsLmNvbSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTczMzg1NjM3MiwiZXhwIjoxNzMzODU5OTcyfQ.PAsjkK7sJNM-nN1ZX0-Up3tvkHiQmpGs1DRwQPmQ3e8')
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({
             message: "Status not found" 
          })
    })
    it("Get para recuperar o Status", async ()=> {   
        const response = await request(app).get('/topic/rw17212367802520ba251/item/rw1726148767193d37419').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQGdtYWlsLmNvbSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTczMzg1NjM3MiwiZXhwIjoxNzMzODU5OTcyfQ.PAsjkK7sJNM-nN1ZX0-Up3tvkHiQmpGs1DRwQPmQ3e8')
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual([{
            "itemId": "rw1726148767193d37419",
            "itemStatus": "Completed"
        }])
    })
})