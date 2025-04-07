const mongoose = require("mongoose");
const validator = require("validator");

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: async function (name) {
          if (!this.isModified("name")) return true;
          const university = await this.constructor.findOne({ name });
          return !university || this._id.equals(university._id);
        },
        message: "University name already exists",
      },
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
universitySchema.index(
  { name: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 },
  }
);

//create a virtual id, convert object to string
universitySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

universitySchema.statics.softDelete = async function (id) {
  try {
    const university = await this.findById(id);
    if (!university) {
      const error = new Error("University not found");
      error.statusCode = 404;
      throw error;
    }
    university.deletedAt = new Date();
    university.isActive = false;
    await university.save();
    return university;
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    throw error;
  }
};

//restore the sfot deleted data
universitySchema.statics.restore = async function (id) {
  try {
    const university = await this.findById(id);
    if (!university) {
      const error = new Error("University not found");
      error.statusCode = 404;
      throw error;
    }
    university.deletedAt = null;
    university.isActive = true;
    await university.save();
    return university;
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    throw error;
  }
};

//toggle the bookmark
universitySchema.statics.toggleBookmark = async function (id) {
  try {
    const university = await this.findById(id);
    if (!university) {
      const error = new Error("University not found");
      error.statusCode = 404;
      throw error;
    }
    university.isBookmark = !university.isBookmark;
    await university.save();
    return university;
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    throw error;
  }
};

universitySchema.query.active = function () {
  return this.where({ isActive: true, deletedAt: null });
};

universitySchema.query.activeFalse = function () {
  return this.or([{ isActive: false }, { deletedAt: { $ne: null } }]);
};

universitySchema.query.bookmarked = function () {
  return this.where({ isBookmark: true });
};

universitySchema.query.bookmarkedFalse = function () {
  return this.where({ isBookmark: false });
};

universitySchema.query.deleted = function () {
  return this.where({ deletedAt: { $ne: null } });
};

universitySchema.query.deletedFalse = function () {
  return this.where({ deletedAt: null });
};

universitySchema.query.createdAfter = function (date) {
  return this.where({ created: { $gte: new Date(date) } });
};

universitySchema.query.byCountry = function (country) {
  return this.where({ country: new RegExp(country, "i") });
};

const isValidURL = (url) => {
  return validator.isURL(url, {
    require_protocol: true,
    protocols: ["http", "https"],
  });
};

module.exports = mongoose.model("University", universitySchema);
