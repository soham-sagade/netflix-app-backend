const router = require("express").Router();
const auth = require("../auth/auth");
const listController = require("../controllers/listController");

router.post("/createList", auth.verifyToken, listController.createList);
router.get("/getLists", auth.verifyToken, listController.getLists);
router.put("/updateList/:id", auth.verifyToken, listController.updateList);
router.delete("/deleteList/:id", auth.verifyToken, listController.deleteList);

module.exports = router;
