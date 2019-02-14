import { expect } from 'chai'

import * as userApi from './userApi'
import * as departmentApi from './departmentApi'

describe('department', () => {
  describe('department(id: ID!):[Department]', () => {
    it('should return detail of department', async ()=>{
      const expectedResult = {
        data: {
          department: {
            id: '5c34574b5ba3f1002f9a18ff',
            name: 'Du Lịch',
            description:'asmdha'
          }
        }
      }
      const { data: { data: { signIn: { token } } } } = await userApi.signIn({ username: 'vinh', password: '123' })
      const result = await departmentApi.department({ id: '5c34574b5ba3f1002f9a18ff' }, token)
      expect(result.data).to.eql(expectedResult)
    })
  })
})

describe('departments', () => {
  describe('departments(page: Int, limit: Int!): [Departments]', () => {
    it('should returns a list of department', async () => {
      const expectedResult = {
        data: {
          departments: [
            {
              id: "5c63d37cd2b66e3594335cd9",
              name: "LKT"
            },
            {
              id: "5c63cd605cf65d05d086c3b1",
              name: "LKT"
            },
            {
              "id": "5c63cd4e6ffc35313ccdc7ea",
              "name": "LKT"
            },
            {
              id: "5c63cd3901a5c31530c5fe31",
              name: "LKT"
            },
            {
              id: "5c63ccdd6257ba1248d67677",
              name: "LKT"
            },
            {
              id: "5c63cca1d8d3f135645bd471",
              name: "LKT"
            },
            {
              id: "5c63c099d5bdb70c34e16ce7",
              name: "LKT"
            },
            {
              name: "NNA",
              description: "NNA"
            }, {
              name: "NNA",
              description: "NNA"
            }, {
              name: "ngôn ngữ anh",
              description: "NN"
            },
            {
              name: "CNTT",
              description: "CNTT"
            }
          ]
        }
      }

      const { data: { data: { signIn: { token } } } } = await userApi.signIn({ username: 'vinh', password: '123' })
      const result = await departmentApi.departments({ limit: 2 }, token)

      expect(result.data).to.eql(expectedResult)
    })
  })

})

describe('createDepartment', () => {
  describe('createDepartment($name:String!,$description:String)', () => {
    it('create Department successful', async () => {
      let expectedResult = {
        data: {
          createDepartment: {
            name: 'LKT',
          }
        }
      }
      const { data: { data: { signIn: { token } } } } = await userApi.signIn({ username: 'vinh', password: '123' })
      console.log(token);
      let result
      try {
        result = await departmentApi.createDepartment({
          name: 'LKT',

        }, token)
      } catch (error) {
        console.log('err: ', error.response.data);
      }
      console.log('expectedResult: ', result.data)
      expect(result.data).to.eql(expectedResult)
    })

    it.only('return fail when create department with empty name', async () => {
      let expectedResult = {
        data: {
          createDepartment: {
            name: null
          }
        }
      }
      const { data: { data: { signIn: { token } } } } = await userApi.signIn({ username: 'vinh', password: '123'})
      console.log(token);

      const result = await departmentApi.createDepartment({

      }, token)
      // console.log('expectedResult: ', result.data)
      expect(result.data).to.eql(expectedResult)

    })
  })
})
