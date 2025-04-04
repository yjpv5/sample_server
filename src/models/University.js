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

universitySchema.methods.softDelete = async () => {
  try {
    this.deletedAt = new Date();
    await this.save();
    return this;
  } catch (error) {
    throw new Error(`Soft delete failed: ${error.message}`);
  }
};

universitySchema.methods.restore = () => {
  this.deletedAt = null;
  return this.save();
};

universitySchema.query.active = () => {
  return this.where({ isActive: true, deletedAt: null });
};

universitySchema.query.bookmarked = () => {
  return this.where({ isBookmark: true });
};

universitySchema.query.deleted = () => {
    return this.where({ deletedAt: { $ne: null } });
};

universitySchema.query.createdAfter = (date) => {
    return this.where({ created: { $gte: new Date(date) } });
};

universitySchema.query.byCountry = (country) => {
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