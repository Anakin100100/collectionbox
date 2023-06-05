import * as z from "zod"

export const collectionBoxPatchSchema = z.object({
  title: z.string().min(3).max(128).optional(),

  // TODO: Type this properly from editorjs block types?
  content: z.any().optional(),
})

export const collectionBoxCreateSchema = z.object({
  content: z.any().optional(),
  organizationId: z.string().min(1),
})
