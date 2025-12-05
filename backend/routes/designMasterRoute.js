import express from 'express'
import {SearchInDesignCode, designCategory,ScrollDesignCode,DesignCategorySearch,DesignCode,DesignFilterByCategory,GetSingnleDesignDetails } from '../controller/DesignMasterController.js'
const router=express.Router()
router.get("/dsgcat",designCategory)
router.get("/search-dmctg",DesignCategorySearch)
router.get("/dsgcd",DesignCode)
router.get("/dsgcat-by-ctg",DesignFilterByCategory)
router.get("/dsgcd/:code",GetSingnleDesignDetails)
router.get("/search",SearchInDesignCode)
router.get("/scroll-testing",ScrollDesignCode)

export default router








