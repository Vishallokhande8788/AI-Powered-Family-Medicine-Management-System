import { useEffect, useState } from "react";
import api from "../api";


const emptyForm = {
  family_member: "",
  title: "",
  document_type: "prescription",
  file: null,
  notes: "",
};


const documentTypes = [
  {
    value: "prescription",
    label: "Prescription",
    icon: "💊",
  },
  {
    value: "lab_report",
    label: "Lab Report",
    icon: "🧪",
  },
  {
    value: "xray",
    label: "X-Ray / Scan",
    icon: "🩻",
  },
  {
    value: "other",
    label: "Other",
    icon: "📄",
  },
];


function MedicalDocuments() {
  const [documents, setDocuments] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      api.defaults.headers.common["Authorization"] =
        `Bearer ${accessToken}`;
    }

    loadData();
  }, []);


  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        documentsResponse,
        membersResponse,
      ] = await Promise.all([
        api.get("family/documents/"),
        api.get("family/family-members/"),
      ]);

      setDocuments(documentsResponse.data);
      setFamilyMembers(membersResponse.data);

    } catch (err) {
      console.error(
        "Medical Documents Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
        "Failed to load medical documents."
      );

    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: files ? files[0] : value,
    }));
  };


  const resetForm = () => {
    setFormData({
      family_member: "",
      title: "",
      document_type: "prescription",
      file: null,
      notes: "",
    });

    setEditingId(null);
    setShowForm(false);
  };


  const openAddForm = () => {
    setMessage("");
    setError("");

    setEditingId(null);

    setFormData({
      family_member: "",
      title: "",
      document_type: "prescription",
      file: null,
      notes: "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const openEditForm = (document) => {
    setMessage("");
    setError("");

    setEditingId(document.id);

    setFormData({
      family_member: document.family_member || "",
      title: document.title || "",
      document_type:
        document.document_type || "other",
      file: null,
      notes: document.notes || "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.family_member) {
      setError("Please select a family member.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a document title.");
      return;
    }

    if (!editingId && !formData.file) {
      setError("Please select a medical document file.");
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();

      data.append(
        "family_member",
        Number(formData.family_member)
      );

      data.append(
        "title",
        formData.title.trim()
      );

      data.append(
        "document_type",
        formData.document_type
      );

      data.append(
        "notes",
        formData.notes.trim()
      );

      if (formData.file) {
        data.append(
          "file",
          formData.file
        );
      }

      let response;

      if (editingId) {

        response = await api.patch(
          `family/documents/${editingId}/`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setDocuments((previous) =>
          previous.map((document) =>
            document.id === editingId
              ? response.data
              : document
          )
        );

        setMessage(
          "Medical document updated successfully."
        );

      } else {

        response = await api.post(
          "family/documents/",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setDocuments((previous) => [
          response.data,
          ...previous,
        ]);

        setMessage(
          "Medical document uploaded successfully."
        );
      }

      resetForm();

    } catch (err) {
      console.error(
        "Save Medical Document Error:",
        err.response?.data || err
      );

      const apiError = err.response?.data;

      if (
        apiError &&
        typeof apiError === "object"
      ) {
        const firstError =
          Object.values(apiError)[0];

        if (Array.isArray(firstError)) {
          setError(firstError[0]);

        } else if (
          typeof firstError === "string"
        ) {
          setError(firstError);

        } else {
          setError(
            "Failed to save medical document."
          );
        }

      } else {
        setError(
          "Failed to save medical document. Please try again."
        );
      }

    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medical document?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");
    setDeletingId(id);

    try {
      await api.delete(
        `family/documents/${id}/`
      );

      setDocuments((previous) =>
        previous.filter(
          (document) =>
            document.id !== id
        )
      );

      setMessage(
        "Medical document deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

    } catch (err) {
      console.error(
        "Delete Medical Document Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
        "Failed to delete medical document."
      );

    } finally {
      setDeletingId(null);
    }
  };


  const getMember = (memberId) => {
    return familyMembers.find(
      (member) =>
        member.id === memberId
    );
  };


  const getDocumentType = (type) => {
    return (
      documentTypes.find(
        (documentType) =>
          documentType.value === type
      ) || documentTypes[3]
    );
  };


  // IMPORTANT:
  // Build the document URL from the same backend
  // URL used by Axios.
  const getFileUrl = (file) => {
    if (!file) {
      return "#";
    }

    // If Django gives a complete URL
    if (
      file.startsWith("http://") ||
      file.startsWith("https://")
    ) {
      // Fix old localhost URLs
      if (
        file.includes("localhost:8000")
      ) {
        return file.replace(
          "http://localhost:8000",
          "https://stunning-waffle-97qxrrrpwr9wf7wxg-8000.app.github.dev"
        );
      }

      return file;
    }

    // api.js baseURL:
    // https://...-8000.app.github.dev/api/
    const backendUrl =
      api.defaults.baseURL.replace(
        /\/api\/?$/,
        ""
      );

    return `${backendUrl}${
      file.startsWith("/") ? "" : "/"
    }${file}`;
  };


  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  const formatFileName = (file) => {
    if (!file) {
      return "Medical Document";
    }

    const parts = file.split("/");

    return parts[parts.length - 1];
  };


  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";


  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 md:py-10">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>

            <div className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
              Documents
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Medical Documents
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Store and manage important medical documents
              for your family.
            </p>

          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            <span className="text-xl">
              +
            </span>

            Add Document
          </button>

        </div>


        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
            ✓ {message}
          </div>
        )}


        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            ⚠ {error}
          </div>
        )}


        {/* FORM */}
        {showForm && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-blue-600">
                    {editingId
                      ? "EDIT DOCUMENT"
                      : "NEW DOCUMENT"}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {editingId
                      ? "Edit Medical Document"
                      : "Upload Medical Document"}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg px-3 py-2 text-xl text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  ×
                </button>

              </div>

            </div>


            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* FAMILY MEMBER */}
                <div>

                  <label className={labelClass}>
                    Family Member *
                  </label>

                  <select
                    name="family_member"
                    value={formData.family_member}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >

                    <option value="">
                      Select family member
                    </option>

                    {familyMembers.map(
                      (member) => (
                        <option
                          key={member.id}
                          value={member.id}
                        >
                          {member.name} (
                          {member.relation})
                        </option>
                      )
                    )}

                  </select>

                </div>


                {/* TITLE */}
                <div>

                  <label className={labelClass}>
                    Document Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Blood Test Report"
                    className={inputClass}
                    maxLength={150}
                    required
                  />

                </div>

              </div>


              {/* TYPE */}
              <div className="mt-6">

                <label className={labelClass}>
                  Document Type
                </label>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                  {documentTypes.map(
                    (type) => {

                      const selected =
                        formData.document_type ===
                        type.value;

                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() =>
                            setFormData(
                              (previous) => ({
                                ...previous,
                                document_type:
                                  type.value,
                              })
                            )
                          }
                          className={`rounded-xl border px-4 py-4 text-left transition ${
                            selected
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                              : "border-slate-200 bg-white hover:border-blue-300"
                          }`}
                        >

                          <div className="text-2xl">
                            {type.icon}
                          </div>

                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            {type.label}
                          </p>

                        </button>
                      );
                    }
                  )}

                </div>

              </div>


              {/* FILE */}
              <div className="mt-6">

                <label className={labelClass}>
                  Medical File{" "}
                  {!editingId && (
                    <span className="text-red-500">
                      *
                    </span>
                  )}
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center hover:border-blue-400 hover:bg-blue-50">

                  <div className="mb-3 text-3xl">
                    📎
                  </div>

                  <p className="font-semibold text-slate-700">
                    {formData.file
                      ? formData.file.name
                      : "Choose a medical document"}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    PDF, JPG, JPEG or PNG
                  </p>

                  <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />

                </label>

                {editingId && (
                  <p className="mt-2 text-xs text-slate-400">
                    Leave the file empty to keep the
                    existing document.
                  </p>
                )}

              </div>


              {/* NOTES */}
              <div className="mt-6">

                <label className={labelClass}>
                  Notes
                </label>

                <textarea
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add useful notes..."
                  className={`${inputClass} resize-none`}
                />

              </div>


              {/* BUTTONS */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Document"
                    : "Upload Document"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}


        {/* DOCUMENT LIST */}
        {loading ? (

          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-slate-600">
              Loading medical documents...
            </p>

          </div>

        ) : documents.length === 0 ? (

          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

            <div className="text-4xl">
              📄
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No medical documents yet
            </h2>

            <p className="mt-2 text-slate-500">
              Upload prescriptions, lab reports,
              X-rays and other important documents.
            </p>

            <button
              type="button"
              onClick={openAddForm}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              + Upload First Document
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {documents.map((document) => {

              const member =
                getMember(
                  document.family_member
                );

              const type =
                getDocumentType(
                  document.document_type
                );

              const fileUrl =
                getFileUrl(
                  document.file
                );

              return (
                <div
                  key={document.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >

                  {/* HEADER */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-5 py-5">

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                        {type.icon}
                      </div>

                      <div className="min-w-0">

                        <h2 className="truncate text-lg font-bold text-slate-900">
                          {document.title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {member?.name ||
                            "Family Member"}

                          {member?.relation
                            ? ` • ${member.relation}`
                            : ""}
                        </p>

                      </div>

                    </div>

                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {type.label}
                    </span>

                  </div>


                  {/* BODY */}
                  <div className="p-5">

                    <div className="rounded-xl bg-slate-50 p-4">

                      <p className="text-xs font-semibold uppercase text-slate-400">
                        File
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-slate-700">
                        {formatFileName(
                          document.file
                        )}
                      </p>

                    </div>


                    {document.uploaded_at && (
                      <div className="mt-4">

                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Uploaded
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {formatDate(
                            document.uploaded_at
                          )}
                        </p>

                      </div>
                    )}


                    {document.notes && (
                      <div className="mt-4">

                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Notes
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {document.notes}
                        </p>

                      </div>
                    )}


                    {/* ACTIONS */}
                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">

                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        View Document
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(document)
                        }
                        className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            document.id
                          )
                        }
                        disabled={
                          deletingId ===
                          document.id
                        }
                        className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        {deletingId ===
                        document.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}


        {/* INFO */}
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">

          <p className="text-sm leading-6 text-blue-800">
            <strong>Tip:</strong> Keep prescriptions,
            lab reports and important medical documents
            organized by family member.
          </p>

        </div>

      </div>

    </div>
  );
}


export default MedicalDocuments;