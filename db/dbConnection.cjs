const sqlite3 = require('sqlite3').verbose();

class DBConnection {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.log('Could not connect to database', err)
            } else {
                console.log('Connected to database')
            }
        })
    }

    seed() {
        const sqlCategory = `
                CREATE TABLE IF NOT EXISTS category (
                    categoryID INTEGER PRIMARY KEY AUTOINCREMENT,
                    name varchar NOT NULL
                )`;
        const sqlHistory = `
                CREATE TABLE IF NOT EXISTS history (
                    "id" INTEGER NOT NULL,
                    "categoryID" INTEGER NOT NULL,
                    "url" TEXT NOT NULL,
                    "visitCount" INTEGER NOT NULL,
                    PRIMARY KEY("id" AUTOINCREMENT)
                )`;
        this.db.run(sqlCategory);
        this.db.run(sqlHistory);
    }

    // "lastVisitTime" TEXT NOT NULL,
    // "title" TEXT NOT NULL,
    // "typedCount" INTEGER NOT NULL,
    crateHistory(item) {
        return this.db.run(
            'INSERT INTO history (id,categoryID ,url,visitCount) VALUES (?,?,?,?)',
            [null, item.id, item.url, item.visitCount]
        )
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = DBConnection
