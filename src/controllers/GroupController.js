import { invitationMail } from "../mailer/invitation/invitationMail.js";
import Group from "../models/Group.js";
import GroupMember from "../models/GroupMember.js";
import User from "../models/User.js";
import makeSlugFrom from "../utils/slug.js";

class GroupController {
  static decryptToken = (combinedToken) => {
    try {
      const encryptedPart = combinedToken.split(".")[1];
      if (!encryptedPart) return null;
      const decodedData = JSON.parse(
        Buffer.from(encryptedPart, "base64").toString()
      );
      return decodedData.email;
    } catch (error) {
      console.error("Error decrypting token:", error);
      return null;
    }
  };
  /**
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
   * @param {import('express').Request} req -Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async getGroup(req, res) {
    try {
      const slug = req.params.slug;
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
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async create(req, res, callback) {
    try {
      const { name, description, maxMembers, tags, isPrivate } = req.body;
      const slug = makeSlugFrom(name, "group");
      const creatorId = req.user.userId;
      const imageUrl = `${process.env.API_URL}/uploads/${req.file.filename}`;
      const group = new Group({
        name,
        slug,
        description,
        creatorId,
        maxMembers,
        tags,
        isPrivate,
        imageUrl,
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
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async update(req, res) {
    try {
      const slug = req.params.slug;
      const { name, description, maxMembers, tags, isPrivate } = req.body;
      const group = await Group.findOne({ slug });
      if (!group) {
        return res.error("Groupe non trouvé", 404);
      }
      if (name && name !== group.name) {
        group.slug = makeSlugFrom(name, "group");
      }
      if (name) group.name = name;
      if (description) group.description = description;
      if (maxMembers) group.maxMembers = maxMembers;
      if (tags) group.tags = tags;
      if (isPrivate !== undefined) group.isPrivate = isPrivate;
      if (req.file) {
        group.imageUrl = `${process.env.API_URL}/uploads/${req.file.filename}`;
      }
      const savedGroup = await group.save();
      if (savedGroup) {
        return res.success(
          { group: savedGroup },
          "Groupe mis à jour avec succès",
          200
        );
      } else {
        return res.error("Impossible de mettre à jour le groupe", 400);
      }
    } catch (error) {
      console.error(error);
      return res.error(
        "Une erreur est survenue lors de la mise à jour du groupe",
        500,
        error
      );
    }
  }

  /**
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async delete(req, res) {
    try {
      const { slug } = req.body;
      const result = await Group.deleteOne({ slug });
      if (result.deletedCount === 0) {
        return res.error("Groupe non trouvé", 404);
      }
      return res.success(null, "Groupe supprimé avec succès", 200);
    } catch (error) {
      console.error(error);
      return res.error(
        "Une erreur est survenue lors de la suppression du groupe",
        500,
        error
      );
    }
  }

  /**
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async sendInvitation(req, res) {
    try {
      const adminId = req.user.userId;
      const { email, groupId } = req.params;
      const user = User.findOne({ email });
      const admin = User.findById(adminId);
      const adminUsername = `${admin.firstName} ${admin.lastName}`;
      const isUserInGroup = GroupMember.findOne({ userId: user._id, groupId });
      if (isUserInGroup) {
        return res.error("Cet utilisateur est déjà membre du groupe", 409);
      }
      const result = await invitationMail({ adminId, adminUsername }, email);
      if (result.success) {
        return res.success([], result.message, 200);
      } else {
        return res.error(result.message, 400);
      }
    } catch (error) {
      console.error(error);
      return res.error(
        "Une erreur est survenue lors de l'envoi de l'invitation",
        500,
        error
      );
    }
  }

  /**
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async joinGroup(req, res) {
    try {
      const result = await Group.deleteOne({ slug });
      if (result.deletedCount === 0) {
        return res.error("Groupe non trouvé", 404);
      }
      return res.success(null, "Groupe supprimé avec succès", 200);
    } catch (error) {
      console.error(error);
      return res.error(
        "Une erreur est survenue lors de la suppression du groupe",
        500,
        error
      );
    }
  }
}
export default GroupController;
