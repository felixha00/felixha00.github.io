import { type SchemaTypeDefinition } from 'sanity'
import { projectType } from './projectType'
import { postType } from './postType'
import { experienceType } from './experienceType'
import { profileType } from './profileType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, postType, experienceType, profileType],
}
