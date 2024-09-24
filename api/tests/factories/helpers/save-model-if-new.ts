import { isUndefined } from "lodash"
import { Model } from "sequelize"

/**
 * Support nested save for associated models.
 *
 * TODO: update this function with an exclude list to deal with circular dependencies.
 */
export async function saveModelIfNew<T extends Model>(
  modelInstance: T | undefined,
  options: { nested?: boolean } = {}
): Promise<void> {
  if (isUndefined(modelInstance)) return

  if (options.nested) {
    const modelClass = modelInstance.constructor as typeof Model
    const associations = modelClass.associations
    const associationNames = Object.keys(associations) as (keyof typeof modelInstance)[]

    for (const associationName of associationNames) {
      const associatedInstance = modelInstance[associationName] as Model | Model[] | undefined

      if (isUndefined(associatedInstance)) {
        continue
      }

      if (Array.isArray(associatedInstance)) {
        for (const instance of associatedInstance) {
          await saveModelIfNew(instance, { nested: true })
        }
      } else {
        await saveModelIfNew(associatedInstance, { nested: true })
      }
    }
  }

  if (modelInstance?.isNewRecord) {
    await modelInstance.save()
  }
}

export default saveModelIfNew
