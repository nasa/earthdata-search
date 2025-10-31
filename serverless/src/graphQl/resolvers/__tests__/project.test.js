import setupServer from './__mocks__/setupServer'

import CREATE_PROJECT from '../../../../../static/src/js/operations/mutations/createProject'
import DELETE_PROJECT from '../../../../../static/src/js/operations/mutations/deleteProject'
import UPDATE_PROJECT from '../../../../../static/src/js/operations/mutations/updateProject'
import GET_PROJECT from '../../../../../static/src/js/operations/queries/getProject'
import GET_PROJECTS from '../../../../../static/src/js/operations/queries/getProjects'

describe('Project Resolver', () => {
  describe('Query', () => {
    describe('project', () => {
      test('returns results with all fields', async () => {
        const databaseClient = {
          getProjectByObfuscatedId: jest.fn().mockResolvedValue({
            id: 1,
            name: 'Test Project',
            path: '/search?ff=Test%20Project',
            user_id: 42,
            updated_at: '2023-06-27T20:22:47.400Z',
            created_at: '2023-06-27T20:22:47.400Z'
          })
        }
        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: GET_PROJECT,
          variables: { obfuscatedId: 'test-obfuscated-id' }
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id')
        expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledTimes(1)

        expect(data).toEqual({
          project: {
            createdAt: '2023-06-27T20:22:47.400Z',
            name: 'Test Project',
            obfuscatedId: '4517239960',
            path: '/search?ff=Test%20Project',
            updatedAt: '2023-06-27T20:22:47.400Z'
          }
        })
      })

      test('throws an error when the query fails', async () => {
        const databaseClient = {
          getProjectByObfuscatedId: jest.fn().mockImplementation(() => {
            throw new Error('Something failed')
          })
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: GET_PROJECT,
          variables: { obfuscatedId: 'test-obfuscated-id' }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        const errorMessage = 'Something failed'
        expect(errors[0].message).toEqual(errorMessage)

        expect(data).toEqual({
          project: null
        })
      })

      describe('when the project does not belong to the user', () => {
        test('returns a new project with the same name and path for the current user', async () => {
          const databaseClient = {
            getProjectByObfuscatedId: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Test Project',
              path: '/search?ff=Test%20Project',
              user_id: 99, // Return a project for a different user
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            }),
            createProject: jest.fn().mockResolvedValue({
              id: 2,
              name: 'Test Project',
              path: '/search?ff=Test%20Project',
              user_id: 42, // Creates the same project for the current user
              updated_at: '2023-06-27T20:22:47.400Z',
              created_at: '2023-06-27T20:22:47.400Z'
            })
          }

          const { contextValue, server } = setupServer({
            databaseClient
          })

          const response = await server.executeOperation({
            query: GET_PROJECT,
            variables: { obfuscatedId: 'test-obfuscated-id' }
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id')
          expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledTimes(1)

          expect(data).toEqual({
            project: {
              createdAt: '2023-06-27T20:22:47.400Z',
              name: 'Test Project',
              obfuscatedId: '7023641925',
              path: '/search?ff=Test%20Project',
              updatedAt: '2023-06-27T20:22:47.400Z'
            }
          })
        })
      })
    })

    describe('projects', () => {
      test('returns results with all fields', async () => {
        const databaseClient = {
          getProjects: jest.fn().mockResolvedValue([
            {
              id: 1,
              name: 'Project 1',
              path: '/search?ff=Map%20Imagery',
              user_id: 42,
              total: '2',
              created_at: '2025-09-16T20:59:44.874Z',
              updated_at: '2025-09-16T20:59:44.874Z'
            },
            {
              id: 2,
              path: '/search?ff=Customizable',
              user_id: 42,
              total: '2',
              created_at: '2025-09-16T20:59:44.874Z',
              updated_at: '2025-09-16T20:59:44.874Z'
            }
          ])
        }
        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: GET_PROJECTS,
          variables: {}
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(databaseClient.getProjects).toHaveBeenCalledTimes(1)
        expect(databaseClient.getProjects).toHaveBeenCalledWith({
          userId: 42,
          limit: 20,
          offset: 0
        })

        expect(data).toEqual({
          projects: {
            count: 2,
            pageInfo: {
              currentPage: 1,
              hasNextPage: false,
              hasPreviousPage: false,
              pageCount: 1
            },
            projects: [
              {
                name: 'Project 1',
                obfuscatedId: '4517239960',
                path: '/search?ff=Map%20Imagery',
                createdAt: '2025-09-16T20:59:44.874Z',
                updatedAt: '2025-09-16T20:59:44.874Z'
              },
              {
                name: null,
                obfuscatedId: '7023641925',
                path: '/search?ff=Customizable',
                createdAt: '2025-09-16T20:59:44.874Z',
                updatedAt: '2025-09-16T20:59:44.874Z'
              }
            ]
          }
        })
      })

      test('throws an error when the query fails', async () => {
        const databaseClient = {
          getProjects: jest.fn().mockImplementation(() => {
            throw new Error('Something failed')
          })
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: GET_PROJECTS,
          variables: {}
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        const errorMessage = 'Something failed'
        expect(errors[0].message).toEqual(errorMessage)

        expect(data).toEqual({
          projects: null
        })
      })

      describe('when requesting multiple pages of results', () => {
        test('returns paginated results', async () => {
          const databaseClient = {
            getProjects: jest.fn().mockResolvedValue([
              {
                id: 3,
                user_id: 42,
                total: 3,
                name: 'Project 3',
                path: '/search?ff=Project%203',
                updated_at: '2023-06-27T20:22:47.400Z',
                created_at: '2023-06-27T20:22:47.400Z'
              }
            ])
          }
          const { contextValue, server } = setupServer({
            databaseClient
          })

          const response = await server.executeOperation({
            query: GET_PROJECTS,
            variables: {
              limit: 2,
              offset: 2
            }
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(databaseClient.getProjects).toHaveBeenCalledWith({
            limit: 2,
            offset: 2,
            userId: 42
          })

          expect(databaseClient.getProjects).toHaveBeenCalledTimes(1)

          expect(data).toEqual({
            projects: {
              count: 3,
              pageInfo: {
                currentPage: 2,
                hasNextPage: false,
                hasPreviousPage: true,
                pageCount: 2
              },
              projects: [{
                createdAt: '2023-06-27T20:22:47.400Z',
                name: 'Project 3',
                obfuscatedId: '2057964173',
                path: '/search?ff=Project%203',
                updatedAt: '2023-06-27T20:22:47.400Z'
              }]
            }
          })
        })
      })
    })
  })

  describe('Mutation', () => {
    describe('createProject', () => {
      test('creates a project successfully', async () => {
        const databaseClient = {
          createProject: jest.fn().mockResolvedValue({
            id: 1,
            name: 'Test Project',
            path: '/test/project',
            user_id: 1,
            created_at: '2025-09-16T20:59:44.874Z',
            updated_at: '2025-09-16T20:59:44.874Z'
          })
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: CREATE_PROJECT,
          variables: {
            name: 'Test Project',
            path: '/test/project'
          }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()

        expect(databaseClient.createProject).toHaveBeenCalledTimes(1)
        expect(databaseClient.createProject).toHaveBeenCalledWith({
          name: 'Test Project',
          path: '/test/project',
          userId: 42
        })

        expect(data).toEqual({
          createProject: {
            createdAt: '2025-09-16T20:59:44.874Z',
            obfuscatedId: '4517239960',
            name: 'Test Project',
            path: '/test/project',
            updatedAt: '2025-09-16T20:59:44.874Z'
          }
        })
      })

      describe('when the project creation fails', () => {
        test('returns an error', async () => {
          const databaseClient = {
            createProject: jest.fn().mockImplementation(() => {
              throw new Error('Something failed')
            })
          }

          const { contextValue, server } = setupServer({
            databaseClient
          })

          const response = await server.executeOperation({
            query: CREATE_PROJECT,
            variables: {
              name: 'Test Project',
              path: '/test/project'
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          const errorMessage = 'Something failed'
          expect(errors[0].message).toEqual(errorMessage)

          expect(data).toEqual({
            createProject: null
          })
        })
      })
    })

    describe('deleteProject', () => {
      test('deletes a project successfully', async () => {
        const databaseClient = {
          deleteProject: jest.fn().mockResolvedValue(1)
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: DELETE_PROJECT,
          variables: {
            obfuscatedId: '2057964173'
          }
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(databaseClient.deleteProject).toHaveBeenCalledWith({
          obfuscatedId: '2057964173',
          userId: contextValue.user.id
        })

        expect(data).toEqual({
          deleteProject: true
        })
      })

      test('returns false when the project is not deleted', async () => {
        const databaseClient = {
          deleteProject: jest.fn().mockResolvedValue(0)
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: DELETE_PROJECT,
          variables: {
            obfuscatedId: '2057964173'
          }
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(databaseClient.deleteProject).toHaveBeenCalledWith({
          obfuscatedId: '2057964173',
          userId: contextValue.user.id
        })

        expect(data).toEqual({
          deleteProject: false
        })
      })

      test('throws an error when the mutation fails', async () => {
        const databaseClient = {
          deleteProject: jest.fn().mockImplementation(() => {
            throw new Error('Failed to delete project')
          })
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: DELETE_PROJECT,
          variables: {
            obfuscatedId: '2057964173'
          }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult
        expect(errors[0].message).toEqual('Failed to delete project')

        expect(data).toEqual({
          deleteProject: null
        })
      })
    })

    describe('updateProject', () => {
      test('updates a project successfully', async () => {
        const databaseClient = {
          updateProject: jest.fn().mockResolvedValue({
            id: 1,
            name: 'Updated Project',
            path: '/updated/project',
            created_at: '2025-09-16T20:59:44.874Z',
            updated_at: '2025-09-16T20:59:44.874Z'
          })
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: UPDATE_PROJECT,
          variables: {
            obfuscatedId: '4517239960',
            name: 'Updated Project',
            path: '/updated/project'
          }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()

        expect(data).toEqual({
          updateProject: {
            createdAt: '2025-09-16T20:59:44.874Z',
            obfuscatedId: '4517239960',
            name: 'Updated Project',
            path: '/updated/project',
            updatedAt: '2025-09-16T20:59:44.874Z'
          }
        })
      })

      describe('when the project update fails', () => {
        test('returns an error message', async () => {
          const databaseClient = {
            updateProject: jest.fn().mockImplementation(() => {
              throw new Error('Something failed')
            })
          }

          const { contextValue, server } = setupServer({
            databaseClient
          })

          const response = await server.executeOperation({
            query: UPDATE_PROJECT,
            variables: {
              obfuscatedId: '4517239960',
              name: 'Updated Project',
              path: '/updated/project'
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          const errorMessage = 'Something failed'
          expect(errors[0].message).toEqual(errorMessage)

          expect(data).toEqual({
            updateProject: null
          })
        })
      })
    })
  })
})
