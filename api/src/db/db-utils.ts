import db, { transactionManager } from "@/db/db-client"
import { Transaction, TransactionOptions } from "sequelize"

/*
Operates just like Sequelize transaction, but nests by default.

e.g. Using this function is the equivalent of using the following code:
db.transaction((t1) => {
  // lots of layers of other code
  db.transaction({ transaction: t1 }, () => {
    // Your nested transaction logic here
  });
});

But without the hassle of having to pass the transaction object around.
*/
function transaction<T>(
  options: TransactionOptions,
  autoCallback: (t: Transaction) => PromiseLike<T>
): Promise<T>
function transaction<T>(autoCallback: (t: Transaction) => PromiseLike<T>): Promise<T>
function transaction(options?: TransactionOptions): Promise<Transaction>
function transaction<T>(
  optionsOrAutoCallback?: TransactionOptions | ((t: Transaction) => PromiseLike<T>),
  autoCallback?: (t: Transaction) => PromiseLike<T>
) {
  const parentTransaction = transactionManager.get("transaction")
  if (typeof optionsOrAutoCallback === "object" && typeof autoCallback === "function") {
    return db.transaction(
      {
        ...optionsOrAutoCallback,
        transaction: parentTransaction,
      },
      autoCallback
    )
  } else if (typeof optionsOrAutoCallback === "function" && autoCallback === undefined) {
    return db.transaction(
      {
        transaction: parentTransaction,
      },
      optionsOrAutoCallback
    )
  } else {
    return db.transaction({
      ...optionsOrAutoCallback,
      transaction: parentTransaction,
    })
  }
}

export { transaction }
