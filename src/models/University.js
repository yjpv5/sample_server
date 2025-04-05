const mongoose = require("mongoose");
const validator = require("validator");

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    webpages: {
      type: [String],
      default: [],
      validate: {
        validator: function (urls) {
          return urls.every((url) => isValidURL(url));
        },
        message: (props) => `${props.value} contains invalid url`,
      },
    },
    isBookmark: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "lastModified",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

universitySchema.virtual("id").get(() => {
  return this._id.toHexString();
});

universitySchema.statics.softDelete = async function (id) {
  try {
    const university = await this.findById(id);
    if (!university) {
      throw new Error('University not found!')
    }
    university.deletedAt = new Date();
    university.isActive = false;
    await university.save()
    return university;
  } catch (error) {
    throw new Error(`Soft delete failed: ${error.message}`);
  }
};

universitySchema.statics.restore = async function (id) {
  try {
    const university = await this.findById(id);
    if (!university) {
      throw new Error('University not found!')
    }
    university.deletedAt = null;
    university.isActive = true;
    await university.save()
    return university;
  } catch (error) {
    throw new Error(`University restore failed: ${error.message}`);
  }
};

universitySchema.statics.toggleBookmark = async function (id) {
  try {
    const university = await this.findById(id);
    if (!university) {
      throw new Error('University not found!')
    }
    university.isBookmark = !university.isBookmark;
    await university.save()
    return university;
  } catch (error) {
    throw new Error(`Toggle bookmark failed: ${error.message}`);
  }
};

universitySchema.query.active = function () {
  return this.where({ isActive: true, deletedAt: null });
};

universitySchema.query.bookmarked = function () {
  return this.where({ isBookmark: true });
};

universitySchema.query.deleted = function () {
  return this.where({ deletedAt: { $ne: null } });
};

universitySchema.query.createdAfter = function (date) {
  return this.where({ created: { $gte: new Date(date) } });
};

universitySchema.query.byCountry = function (country) {
  return this.where({ country: new RegExp(country, 'i') });
};

const isValidURL = (url) => {
  return validator.isURL(url, {
    require_protocol: true,
    protocols: ["http", "https"],
  });
};

// const activeUniversities = await University.find().active();
// const usUniversities = await University.find().active().byCountry('united states');
// const recentBookmarks = await University.find().bookmarked().createdAfter('2025-01-01');
// const recentlyUpdated = await University.find().active().recentlyModified(7);
// const searchResults = await University.find().active().nameContains('tech');