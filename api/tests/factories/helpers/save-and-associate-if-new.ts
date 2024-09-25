import { Model } from "sequelize"

import saveModelIfNew from "@/factories/helpers/save-model-if-new"

export async function saveAndAssociateIfNew<M extends Model>(
  model: M,
  associationName: keyof M & string,
  options: {
    nested?: boolean
    foreignKey?: string
    sourceKey?: string
  } = {}
): Promise<void> {
  const nested = options.nested ?? false
  const sourceKey = options.sourceKey ?? "id"
  const foreignKeyName = options.foreignKey ?? `${associationName}Id`

  let foreignKeyValue = model.get(foreignKeyName)
  if (foreignKeyValue !== undefined) return

  const association = model[associationName] as Model | undefined
  if (association === undefined) return

  await saveModelIfNew(association, { nested })
  foreignKeyValue = association.get(sourceKey)
  model.set(foreignKeyName, foreignKeyValue)
}

export default saveAndAssociateIfNew
