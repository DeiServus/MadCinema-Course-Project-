const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class EmployeeService{
    async findEmployeeByName(name){
        const employee = await prisma.employee.findMany({
            where:{
                name:{
                    contains: name
                }
            }
        });
        return employee;
    }

    async addEmployee(name, birthday, birthplace, description){
        const employee = await prisma.employee.create({
            data:{
                name: name,
                birthday: birthday,
                birthplace: birthplace,
                description: description
            }
        })
        return {employee: employee}
    }

    async updateEmployee(id, name, description, birthday, birthplace){
        const employee = await prisma.employee.delete({
            where:{
                id: id
            },
            data:{
                name: name,
                birthday: birthday,
                birthplace: birthplace,
                description: description
            }
        })
        return {employee: employee}
    }

    async deleteEmployee(id){
        const employee = await prisma.employee.delete({
            where:{
                id: id
            }
        })
        return {employee: employee}
    }
}

module.exports = new EmployeeService();