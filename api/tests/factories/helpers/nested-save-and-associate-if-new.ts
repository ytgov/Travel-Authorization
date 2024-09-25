import { Model } from "sequelize"

export async function nestedSaveAndAssociateIfNew<M extends Model>(modelInstance: M): Promise<M> {
  const modelClass = modelInstance.constructor as typeof Model
  const associations = modelClass.associations

  for (const associationName of Object.keys(associations)) {
    const associationDefinition = associations[associationName]
    if (associationDefinition.associationType !== "BelongsTo") {
      continue
    }

    const foreignKeyName = associationDefinition.foreignKey
    let foreignKeyValue = modelInstance.get(foreignKeyName)
    if (foreignKeyValue !== undefined) continue

    // Maybe should be associationAccessor instead of as?
    const associationAlias = associationDefinition.as as keyof M
    const associatedInstance = modelInstance[associationAlias] as Model | undefined
    if (associatedInstance === undefined) continue
    if (associatedInstance.isNewRecord !== true) continue

    const updatedAssocationInstance = await nestedSaveAndAssociateIfNew(associatedInstance)

    // @ts-expect-error - TS doesn't know that targetKey is a property of associationDefinition
    const { targetKey }: { targetKey: keyof Model } = associationDefinition
    foreignKeyValue = updatedAssocationInstance.get(targetKey)
    modelInstance.set(foreignKeyName, foreignKeyValue)
  }

  if (modelInstance.isNewRecord !== true) return modelInstance

  return modelInstance.save()
}

export default nestedSaveAndAssociateIfNew
