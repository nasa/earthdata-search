import 'array-foreach-async'

export const migrateProjects = async (oldDbConnection, newDbConnection) => {
  const oldProjects = await oldDbConnection('projects')
    .select([
      'id',
      'user_id',
      'path',
      'name',
      'created_at',
      'updated_at'
    ])
    .orderBy('id')

  await oldProjects.forEachAsync(async (oldProject) => {
    const {
      id,
      user_id: userId,
      path,
      name,
      created_at: createdAt,
      updated_at: updatedAt
    } = oldProject

    const [projectPath, queryParams] = path.split('?')

    // Default migrated path to the original
    let migratedPath = projectPath

    console.log(projectPath)

    // Modify the path if previous path no longer exists
    if (projectPath === '/search/project/granules') {
      migratedPath = '/search/granules'
    } else if (projectPath === '/projects/new') {
      migratedPath = '/projects'
    } else if (projectPath === '/search/project') {
      migratedPath = '/projects'
    } else if (projectPath === '/') {
      migratedPath = '/search'
    }

    try {
      await newDbConnection('projects').insert({
        id,
        user_id: userId,
        path: `${migratedPath}?${queryParams}`,
        name,
        created_at: createdAt,
        updated_at: updatedAt
      })

      console.log(`Successfully inserted project record with ID ${id}`)
    } catch (e) {
      console.log(e.message)
    }
  })
}
