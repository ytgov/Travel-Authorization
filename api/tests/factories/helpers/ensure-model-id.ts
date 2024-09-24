import { isNil } from "lodash"
import { ForeignKey, Model } from "sequelize"

// This custom type can be removed in Sequelize 7.
type FisheryForeignKeyNumber = Partial<ForeignKey<number>>

export function ensureModelId<T extends Model & { id: number }>(
  potentialIdFromParams: FisheryForeignKeyNumber | number | null | undefined,
  potentialModelFromAssociations: T | undefined,
  buildModel: () => T
): {
  id: number
  model: T | undefined
} {
  let model: T | undefined = potentialModelFromAssociations
  // Cast of potentialIdFromParams can be removed in Sequelize 7.
  let modelId = (potentialIdFromParams as number | null | undefined) || model?.id
  if (isNil(modelId)) {
    model = buildModel()
    modelId = model.id
  }

  return {
    id: modelId,
    model: model,
  }
}

export default ensureModelId
