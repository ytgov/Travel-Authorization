import http from "@/api/http-client"

export const generalLedgerCodingsApi = {
  list({ where, page, perPage, ...otherParams } = {}) {
    return http
      .get("/api/generalLedgerCodings", { params: { where, page, perPage, ...otherParams } })
      .then(({ data }) => data)
  },
  create(attributes) {
    return http.post("/api/general-ledger-codings", attributes).then(({ data }) => data)
  },
  update(generalLedgerCodingId, attributes) {
    return http
      .patch(`/api/general-ledger-codings/${generalLedgerCodingId}`, attributes)
      .then(({ data }) => data)
  },
  delete(generalLedgerCodingId) {
    return http
      .delete(`/api/general-ledger-codings/${generalLedgerCodingId}`)
      .then(({ data }) => data)
  },
}

export default generalLedgerCodingsApi
