// const express = require("express");
// const router = express.Router();
// const { sql, config } = require("./db"); // Import from db.js
// const cors = require("cors");
// const app = express();

// app.use(cors());


// app.use(express.json());

// /* TEST */
// router.get("/test", (req, res) => {
//     res.send("Hello Test");
// });

// /* Get Category*/
// // router.get("/category", async (req, res) => {
// //     try {
// //         console.log("Fetching all records from DsgMst table");
// //         let pool = await sql.connect(config);
// //         let result = await pool.request().query(

// // "Select  distinct dmctg from DsgMst "

// // );

// //         console.log("Records fetched successfully:", result.recordset);
// //         res.json(result.recordset);
// //     } catch (err) {
// //         console.log(err);
// //         res.status(500).send(err.message);
// //     }
// // });


// router.get("/dsgctg", async (req, res) => {
//     try {
//         console.log("Fetching all records from DsgMst table");
        
//         let pool = await sql.connect(config);
        
//  let result = await pool.request().query(`
//     SELECT TOP 100 * 
//     FROM DsgMst
//     ORDER BY DmCtg ASC, DmDesc ASC
// `);


//         res.json({
//             success: true,
//             message: "Data fetched successfully",
//             data: result.recordset
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(500).send(err.message);
//     }
// });
// router.get("/dsgcd", async (req, res) => {
//     try {
//         console.log("Fetching all records from DsgMst table");
        
//         let pool = await sql.connect(config);
        
//        let result = await pool.request().query(`
//     SELECT TOP 100 * 
//     FROM DsgMst
//     ORDER BY DmCtg ASC, DmDesc ASC
// `);


//         res.json({
//             success: true,
//             message: "Data fetched successfully",
//             data: result.recordset
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(500).send(err.message);
//     }
// });
// //by using 
// router.get("/dsgcd/:code", async (req, res) => { 
//     try {
//         const dmCode = req.params.code;  

//         let pool = await sql.connect(config);

//         let result = await pool.request()
//             .input("DmCd", sql.VarChar, dmCode)
//             .query(`
//                 SELECT *
//                 FROM DsgMst
//                 WHERE DmCd = @DmCd
//             `);

//         res.json({
//             success: true,
//             message: "Record fetched successfully",
//             data: result.recordset
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(500).send(err.message);
//     }
// });
// ///param




//   router.get("/param", async (req, res) => {
//     try {
//         console.log("Fetching all records from DsgMst table");
        
//         let pool = await sql.connect(config);
        
//        let result = await pool.request().query(`
//      SELECT  TOP 100 * FROM Param
// `);


//         res.json({
//             success: true,
//             message: "Data fetched successfully",
//             data: result.recordset
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(500).send(err.message);
//     }
// });

// //ctg
// router.get("/dsgcat", async (req, res) => {
//     try {
//         console.log("Fetching all records from DsgMst table");
        
//         let pool = await sql.connect(config);
        
//        let result = await pool.request().query(`
//     SELECT distinct dmctg
// FROM DsgMst
// ORDER BY DmCtg 

// `);


//         res.json({
//             success: true,
//             message: "Data fetched successfully",
//             data: result.recordset
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(500).send(err.message);
//     }
// });

// ///ctg id
// router.get("/dsgcat-by-ctg", async (req, res) => {
//     try {
//         const { dmctg } = req.query;

//         console.log("Fetching records for DmCtg:", dmctg);

//         let pool = await sql.connect(config);

//         let query = `
//             SELECT *
//             FROM DsgMst
//             WHERE (@dmctg IS NULL OR DmCtg = @dmctg)
//             ORDER BY DmDesc;
//         `;

//         let result = await pool.request()
//             .input("dmctg", sql.VarChar, dmctg || null)
//             .query(query);

//         res.json({
//             success: true,
//             message: "Data fetched successfully",
//             data: result.recordset
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(500).send(err.message);
//     }
// });











// /* READ all users */


// /* READ single user */


// /* REGISTER ROUTER */
// app.use("/api/users", router);

// const PORT = 5000;

// /* --- STARTUP LOGIC --- */

// // 1. Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// // 2. Check Database Connection
// sql.connect(config)
//     .then(pool => {
//         if (pool.connected) {
//             console.log("✅ Database Connected Successfully");
//         }
//         return pool;
//     })
//     .catch(err => {
//         console.error("❌ Database Connection Failed:", err);
//     });


const express = require("express");
const router = express.Router();
const { sql, config } = require("./db"); 
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

/* --- 1. Get Distinct Categories (Left Dropdown ke liye) --- */
router.get("/dsgcat", async (req, res) => {
    try {
        console.log("Fetching distinct categories");
        let pool = await sql.connect(config);
        
        let result = await pool.request().query(`
            SELECT DISTINCT dmctg
            FROM DsgMst
            ORDER BY DmCtg
        `);

        res.json({
            success: true,
            message: "Categories fetched successfully",
            data: result.recordset
        });

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

//search category

router.get("/search-dmctg", async (req, res) => {
    try {
        const { text } = req.query;

        let pool = await sql.connect(config);

        let result = await pool.request()
            .input("text", sql.VarChar, text)
            .query(`
                SELECT DISTINCT DmCtg
                FROM DsgMst
                WHERE DmCtg LIKE '%' + @text + '%'
                ORDER BY DmCtg;
            `);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});


/* --- 2. Get All Designs (Right Dropdown - Initial Load ke liye) --- */
router.get("/dsgcd", async (req, res) => {
    try {
        console.log("Fetching all designs (Top 100)");
        let pool = await sql.connect(config);
        
        let result = await pool.request().query(`
            SELECT TOP 100 * 
            FROM DsgMst
            ORDER BY DmCtg ASC, DmDesc ASC
        `);

        res.json({
            success: true,
            message: "Designs fetched successfully",
            data: result.recordset
        });

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});




/* --- 3. Get Designs Filtered by Category (Category Select karne par) --- */
router.get("/dsgcat-by-ctg", async (req, res) => {
    try {
        const { dmctg } = req.query;
        console.log("Fetching designs for Category:", dmctg);

        let pool = await sql.connect(config);

        let query = `
            SELECT *
            FROM DsgMst
            WHERE (@dmctg IS NULL OR DmCtg = @dmctg)
            ORDER BY DmDesc;
        `;

        let result = await pool.request()
            .input("dmctg", sql.VarChar, dmctg || null)
            .query(query);

        res.json({
            success: true,
            message: "Filtered data fetched successfully",
            data: result.recordset
        });

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

/* --- 4. Get Single Design Details (Form fill karne ke liye) --- */
router.get("/dsgcd/:code", async (req, res) => { 
    try {
        const dmCode = req.params.code;  
        console.log("Fetching details for Design Code:", dmCode);

        let pool = await sql.connect(config);

        let result = await pool.request()
            .input("DmCd", sql.VarChar, dmCode)
            .query(`
                SELECT *
                FROM DsgMst
                WHERE DmCd = @DmCd
            `);

        res.json({
            success: true,
            message: "Record fetched successfully",
            data: result.recordset
        });

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});



//Search Here 
// --- Search Route (Optimized to fix Hanging) ---
router.get("/search", async (req, res) => {
    try {
        const { text } = req.query; 
        console.log("Searching for:", text);

        let pool = await sql.connect(config);

        // FIX 1: 'TOP 50' lagaya taaki browser crash na ho
        // FIX 2: Baki columns (DmDesc, DmSz, DmCtg) bhi mangwaye taaki dropdown khali na dikhe
        // FIX 3: OR condition lagayi taaki Code aur Description dono search ho
        let result = await pool.request()
            .input("text", sql.VarChar, text || "")
            .query(`
                SELECT TOP 50 DmCd, DmSz, DmDesc, DmCtg
                FROM DsgMst
                WHERE DmCd LIKE '%' + @text + '%' 
                   OR DmDesc LIKE '%' + @text + '%'
                ORDER BY DmCd;
            `);

        res.json({
            success: true,
            message: "Search results fetched",
            data: result.recordset
        });

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

///infinite scrool testing 

router.get('/scroll-testing', async (req, res) => {
    try {
        let { search = "", page = 1, limit = 50 } = req.query;

        // Integers mein convert karein
        page = parseInt(page);
        limit = parseInt(limit);
        if (page < 1) page = 1;

        let offset = (page - 1) * limit;

        let pool = await sql.connect(config);

        // SQL Query (Sirf wahi columns mangayein jo dropdown me dikhane hain)
        // Note: ORDER BY zaroori hai OFFSET/FETCH ke liye
        let query = `
            SELECT DmCd, DmDesc, DmCtg
            FROM DsgMst
            WHERE DmDesc LIKE @search
            ORDER BY DmDesc ASC 
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `;

        let result = await pool.request()
            .input('search', sql.VarChar, `%${search}%`)
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit)
            .query(query);

        res.json(result.recordset);

    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).send(err.message);
    }
});
/* REGISTER ROUTER */
app.use("/api/users", router);

const PORT = 5000;

/* --- STARTUP LOGIC --- */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Database Connection Check
sql.connect(config)
    .then(pool => {
        if (pool.connected) {
            console.log("✅ Database Connected Successfully");
        }
        return pool;
    })
    .catch(err => {
        console.error("❌ Database Connection Failed:", err);
    });