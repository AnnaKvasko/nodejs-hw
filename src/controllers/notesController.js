import createHttpError from 'http-errors';
import Note from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { tag, search } = req.query;

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const perPage = Math.max(parseInt(req.query.perPage, 10) || 10, 1);
    const skip = (page - 1) * perPage;
    const filter = {};
    if (tag) filter.tag = tag;
    if (search) filter.$text = { $search: search };

    const totalNotes = await Note.countDocuments(filter);
    const totalPages = totalNotes === 0 ? 0 : Math.ceil(totalNotes / perPage);

    let query = Note.find(filter).skip(skip).limit(perPage);

    if (search) {
      query = query
        .select({ score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const notes = await query.exec();

    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedNote) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(updatedNote);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(deletedNote);
  } catch (err) {
    next(err);
  }
};
