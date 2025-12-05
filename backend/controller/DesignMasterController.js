import { sqlInstance as sql, config } from "../db.js";
export const designCategory=async(req,res)=>{

      try {
        console.log("Fetching all categories from param table");

        let pool = await sql.connect(config);

        // Fetch all categories from param where ptyp = 'dmctg'
        let result = await pool.request().query(`
            SELECT pmcd 
            FROM param 
            WHERE ptyp = 'dmctg'
            ORDER BY pmcd;
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
}

export const DesignCategorySearch=async(req,res)=>{

      try {
        const { text } = req.query;

        let pool = await sql.connect(config);

        // Search categories in param table where ptyp = 'dmctg'
        let result = await pool.request()
            .input("text", sql.VarChar, text)
            .query(`
                SELECT pmcd
                FROM param
                WHERE ptyp = 'dmctg' AND pmcd LIKE '%' + @text + '%'
                ORDER BY pmcd;
            `);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}


export const DesignCode=async(req,res)=>{

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
}



export const DesignFilterByCategory=async(req,res)=>{

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


            console.log(result.recordset)
        res.json({
            success: true,
            message: "Filtered data fetched successfully",
            data: result.recordset
        });

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}
export const GetSingnleDesignDetails=async(req,res)=>{

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
}
export const SearchInDesignCode=async(req,res)=>{

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
}




export const ScrollDesignCode=async(req,res)=>{

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
}

