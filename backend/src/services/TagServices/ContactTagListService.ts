import { Op, Sequelize } from "sequelize";
import Tag from "../../models/Tag";
import Contact from "../../models/Contact";

interface Request {
  searchParam?: string;
}

const ContactTagListService = async ({
  searchParam
}: Request): Promise<Tag[]> => {
  let whereCondition = {};

  if (searchParam) {
    whereCondition = {
      [Op.or]: [
        { name: {[Op.like]: `%${searchParam}%`} },
        { color: {[Op.like]: `%${searchParam}%`} }
      ]
    }
  }

  const tags = await Tag.findAll({
    where: whereCondition,
    order: [["name", "ASC"]],
    include: [{
      model: Contact,
      as: 'contacts',
    }],
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
      include: [[Sequelize.fn("COUNT", Sequelize.col("contacts.id")), "contactsCount"]]
    },
    group: [
      "Tag.id",
      "contacts.ContactTags.tagId",
      "contacts.ContactTags.contactId",
      "contacts.ContactTags.createdAt",
      "contacts.ContactTags.updatedAt",
      "contacts.id"
    ]
  });

  return tags;
};

export default ContactTagListService;
