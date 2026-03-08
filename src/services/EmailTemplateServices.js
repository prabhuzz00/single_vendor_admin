import requests from "./httpService";

const EmailTemplateServices = {
  getAllTemplates: async () => {
    return requests.get("/email-templates");
  },

  getTemplateById: async (id) => {
    return requests.get(`/email-templates/${id}`);
  },

  getTemplateByName: async (name) => {
    return requests.get(`/email-templates/name/${name}`);
  },

  addTemplate: async (body) => {
    return requests.post("/email-templates/add", body);
  },

  updateTemplate: async (id, body) => {
    return requests.put(`/email-templates/${id}`, body);
  },

  toggleStatus: async (id) => {
    return requests.patch(`/email-templates/status/${id}`);
  },

  deleteTemplate: async (id) => {
    return requests.delete(`/email-templates/${id}`);
  },

  seedDefaults: async () => {
    return requests.post("/email-templates/seed");
  },
};

export default EmailTemplateServices;
