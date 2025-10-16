import Group from "../models/Group.js";
import makeSlugFrom from "../utils/slug.js";

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
    const slug = req.params.slug;
    try {
      const group = await Group.findOne({ slug });
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
    const creatorId = req.user.userId;
    const { name, description, maxMembers, tags, isPrivate } = req.body;
    const nationalIdImageUrl = `${process.env.API_URL}/uploads/${req.file.filename}`;
    try {
      const slug = makeSlugFrom(name, "group");
      const group = new Group({
        name,
        slug,
        description,
        creatorId,
        maxMembers,
        tags,
        isPrivate,
      });

      const savedGroup = await group.save();
      if (savedGroup) {
        return res.success(
          { group: savedGroup },
          "Groupe créé avec succès",
          201
        );
      } else {
        return res.error("Impossible de créer le groupe", 400);
      }
    } catch (error) {
      console.error(error);
      return res.error(
        "Une erreur est survenue lors de la création du groupe",
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
