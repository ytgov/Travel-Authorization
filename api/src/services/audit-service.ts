import dbLegacy from "@/db/db-client-legacy"

export class AuditService {
  async log(userId: number, taid: number, action: string, note?: string): Promise<any | undefined> {
    try {
      const timestamp = new Date()
      await dbLegacy("auditHistory").insert({
        userId,
        taid,
        action,
        note,
        timestamp,
      })

      return true
    } catch (error: any) {
      console.log(error)
    }
  }

  insertAudit(userId: number, taid: number, action: string, note?: string){
    
  }
}
