import Group from "../models/Group.js";

class GroupController {
  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async getGroups(req, res) {
    try {
      const groups = await Group.find();
      if (groups.length <= 0) {
        return res.success([], "Aucun groupe trouvé", 200);
      }
      return res.success({ groups }, "Groupes récupérés avec succès", 200);
    } catch (error) {
      console.error(error);
      return res.error(
        "Une erreur est survenue lors de la récupération des groupes",
        500,
        error
      );
    }
  }

  /**
   * User controller function
   * @param {import('express').Request} req -Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async getGroup(req, res) {
    const groupId = req.query.groupId;
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.error("Groupe non trouvé", 404);
      }
      return res.success({ group }, "Groupe récupéré avec succès", 200);
    } catch (error) {
      console.error(error);
      return res.error(
        "Une erreur est survenue lors de la récupération du groupe",
        500,
        error
      );
    }
  }

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async create(req, res) {
    const {} = req.body;
    try {
    } catch (error) {}
  }

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async update(req, res) {
    try {
    } catch (error) {}
  }

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async delete(req, res) {
    try {
    } catch (error) {}
  }
}
export default GroupController;
