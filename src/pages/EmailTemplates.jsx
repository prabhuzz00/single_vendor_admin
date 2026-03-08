import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableContainer,
  Button,
  Badge,
} from "@windmill/react-ui";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiDatabase,
} from "react-icons/fi";
import { notifySuccess, notifyError } from "@/utils/toast";
import useAsync from "@/hooks/useAsync";
import EmailTemplateServices from "@/services/EmailTemplateServices";
import PageTitle from "@/components/Typography/PageTitle";
import Loading from "@/components/preloader/Loading";

// ── inline editor modal ──────────────────────────────────────────────────────
const EMPTY = { name: "", subject: "", description: "", htmlContent: "" };

const TemplateModal = ({ template, onClose, onSave }) => {
  const [form, setForm] = useState(template || EMPTY);
  const [saving, setSaving] = useState(false);

  const handle = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.subject || !form.htmlContent) {
      return notifyError("Name, Subject, and HTML Content are required.");
    }
    setSaving(true);
    try {
      if (form._id) {
        await EmailTemplateServices.updateTemplate(form._id, form);
      } else {
        await EmailTemplateServices.addTemplate(form);
      }
      notifySuccess("Template saved successfully!");
      onSave();
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl mt-8 mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {form._id ? "Edit Email Template" : "New Email Template"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template Name <span className="text-red-500">*</span>
                <span className="ml-1 font-normal text-gray-400 text-xs">
                  (slug, e.g. order-confirmation)
                </span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handle}
                disabled={!!form._id}
                placeholder="order-confirmation"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject <span className="text-red-500">*</span>
                <span className="ml-1 font-normal text-gray-400 text-xs">
                  (Handlebars OK)
                </span>
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handle}
                placeholder="Your Order #{{invoiceNo}} Confirmed"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handle}
              placeholder="When is this email sent?"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              HTML Content <span className="text-red-500">*</span>
              <span className="ml-1 font-normal text-gray-400 text-xs">
                (Use {"{{variable}}"} for dynamic values)
              </span>
            </label>
            <textarea
              name="htmlContent"
              value={form.htmlContent}
              onChange={handle}
              rows={16}
              placeholder="<html>...</html>"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── main page ────────────────────────────────────────────────────────────────
const EmailTemplates = () => {
  const [reload, setReload] = useState(0);
  const [modal, setModal] = useState(null); // null | {} | template object
  const [seeding, setSeeding] = useState(false);

  const { data, loading, error } = useAsync(
    () => EmailTemplateServices.getAllTemplates(),
    [reload],
  );

  const templates = Array.isArray(data) ? data : [];

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete template "${name}"?`)) return;
    try {
      await EmailTemplateServices.deleteTemplate(id);
      notifySuccess("Template deleted.");
      setReload((r) => r + 1);
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await EmailTemplateServices.toggleStatus(id);
      notifySuccess(`Template ${res.isActive ? "activated" : "deactivated"}.`);
      setReload((r) => r + 1);
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await EmailTemplateServices.seedDefaults();
      notifySuccess(
        res.results.map((r) => `${r.name}: ${r.status}`).join(" | "),
      );
      setReload((r) => r + 1);
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <>
      <PageTitle>Email Templates</PageTitle>

      {/* ── toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Templates stored in MongoDB. Local <code>.hbs</code> files are used as
          fallback.
        </p>
        <div className="flex gap-3">
          <Button
            size="small"
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 border-0"
          >
            <FiDatabase className="text-sm" />
            {seeding ? "Seeding…" : "Seed Defaults"}
          </Button>
          <Button
            size="small"
            onClick={() => setModal({})}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 border-0"
          >
            <FiPlus className="text-sm" />
            New Template
          </Button>
        </div>
      </div>

      {/* ── table ── */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Description</TableCell>
              <TableCell className="text-center">Status</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </tr>
          </TableHeader>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <Loading loading={loading} />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-red-500">
                  Failed to load templates.
                </td>
              </tr>
            ) : templates.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  No templates found. Click <strong>Seed Defaults</strong> to
                  add the built-in templates.
                </td>
              </tr>
            ) : (
              templates.map((tpl) => (
                <tr
                  key={tpl._id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <TableCell>
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                      {tpl.name}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {tpl.subject}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {tpl.description || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge type={tpl.isActive ? "success" : "danger"}>
                      {tpl.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleToggle(tpl._id)}
                        title={tpl.isActive ? "Deactivate" : "Activate"}
                        className={`text-lg ${tpl.isActive ? "text-emerald-500" : "text-gray-400"} hover:opacity-70`}
                      >
                        {tpl.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                      <button
                        onClick={() => setModal(tpl)}
                        title="Edit"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(tpl._id, tpl.name)}
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </TableCell>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      {/* ── editor modal ── */}
      {modal !== null && (
        <TemplateModal
          template={modal._id ? modal : null}
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            setReload((r) => r + 1);
          }}
        />
      )}
    </>
  );
};

export default EmailTemplates;
