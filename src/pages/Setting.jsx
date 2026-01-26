import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Select } from "@windmill/react-ui";

//internal import
import Error from "@/components/form/others/Error";
import PageTitle from "@/components/Typography/PageTitle";
import useSettingSubmit from "@/hooks/useSettingSubmit";
import InputArea from "@/components/form/input/InputArea";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import AnimatedContent from "@/components/common/AnimatedContent";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import SettingContainer from "@/components/settings/SettingContainer";
import SelectTimeZone from "@/components/form/selectOption/SelectTimeZone";
import SelectCurrency from "@/components/form/selectOption/SelectCurrency";
import SelectReceiptSize from "@/components/form/selectOption/SelectPrintSize";
import SelectLanguageThree from "@/components/form/selectOption/SelectLanguageThree";
import { Button } from "@windmill/react-ui";

const Setting = () => {
  const {
    watch,
    errors,
    register,
    isSave,
    setValue,
    isSubmitting,
    onSubmit,
    handleSubmit,
    enableInvoice,
    setEnableInvoice,
    isAllowAutoTranslation,
    setIsAllowAutoTranslation,
    sitemapOptions,
    setSitemapOptions,
    sitemapUrl,
    setSitemapUrl,
  } = useSettingSubmit();

  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  return (
    <>
      <PageTitle>{t("Setting")}</PageTitle>
      <AnimatedContent>
        <div className="sm:container w-full md:p-6 p-4 mx-auto bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <SettingContainer
              isSave={isSave}
              title={t("Setting")}
              isSubmitting={isSubmitting}
            >
              <div className="flex-grow scrollbar-hide w-full max-h-full">
                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                    {t("NumberOfImagesPerProduct")}
                  </label>
                  <div className="sm:col-span-3">
                    <InputAreaTwo
                      required={true}
                      register={register}
                      label={t("NumberOfImagesPerProduct")}
                      name="number_of_image_per_product"
                      type="number"
                      placeholder={t("NumberOfImagesPerProduct")}
                    />
                    <Error errorName={errors.number_of_image_per_product} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm text-gray-600 font-semibold dark:text-gray-400 mb-1 sm:col-span-2">
                    {t("DefaultCurrency")}
                  </label>

                  <div className="sm:col-span-3">
                    <div className="col-span-8 sm:col-span-4">
                      <SelectCurrency
                        register={register}
                        label="Currency"
                        name="default_currency"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                    {t("TimeZone")}
                  </label>

                  <div className="sm:col-span-3">
                    <SelectTimeZone
                      register={register}
                      name="default_time_zone"
                      label="Time Zone"
                    />
                    <Error errorName={errors.default_time_zone} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                  <label className="block text-sm text-gray-600 font-semibold dark:text-gray-400 mb-1 sm:col-span-2">
                    {t("ReceiptSize")}
                  </label>
                  <div className="sm:col-span-3">
                    <SelectReceiptSize
                      label="Role"
                      register={register}
                      name="receipt_size"
                      required={true}
                    />
                    <Error errorName={errors.receipt_size} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                  <label className="block text-sm text-gray-600 font-semibold dark:text-gray-400 mb-1 sm:col-span-2">
                    Enable Invoice Send to Customer by email
                  </label>
                  <div className="sm:col-span-3">
                    <SwitchToggle
                      id="enable-invoice"
                      processOption={enableInvoice}
                      handleProcess={setEnableInvoice}
                    />
                  </div>
                </div>

                <div
                  style={{
                    height: enableInvoice ? "auto" : 0,
                    transition: "all .6s",
                    visibility: !enableInvoice ? "hidden" : "visible",
                    opacity: !enableInvoice ? "0" : "1",
                  }}
                  className={`${enableInvoice ? "mb-8" : "mb-2"}`}
                >
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <label className="block text-sm text-gray-600 font-semibold dark:text-gray-400 mb-1 sm:col-span-2">
                      From Email
                    </label>
                    <div className="sm:col-span-3">
                      <InputArea
                        required={enableInvoice}
                        register={register}
                        label="From Email"
                        name="from_email"
                        type="email"
                        placeholder="Enter from email on custom invoice"
                      />
                      <Error errorName={errors.from_email} />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                    {t("ShopName")}
                  </label>
                  <div className="sm:col-span-3">
                    <InputAreaTwo
                      required={true}
                      register={register}
                      label={t("ShopName")}
                      name="shop_name"
                      type="text"
                      placeholder={t("ShopName")}
                    />
                    <Error errorName={errors.shop_name} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                    {t("InvoiceCompanyName")}
                  </label>
                  <div className="sm:col-span-3">
                    <InputAreaTwo
                      required={true}
                      register={register}
                      label={t("InvoiceCompanyName")}
                      name="company_name"
                      type="text"
                      placeholder={t("InvoiceCompanyName")}
                    />
                    <Error errorName={errors.company_name} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                    {t("AddressLine")}
                  </label>
                  <div className="sm:col-span-3">
                    <InputAreaTwo
                      required={true}
                      register={register}
                      label="Address"
                      name="address"
                      type="text"
                      placeholder="Address"
                    />
                    <Error errorName={errors.address} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                    {t("PostCode")}
                  </label>
                  <div className="sm:col-span-3">
                    <InputAreaTwo
                      register={register}
                      label="Address"
                      name="post_code"
                      type="text"
                      placeholder="Post Code"
                    />
                    <Error errorName={errors.post_code} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                    {t("GlobalContactNumber")}
                  </label>
                  <div className=" sm:col-span-3">
                    <InputAreaTwo
                      required={true}
                      register={register}
                      label="Phone"
                      name="contact"
                      type="text"
                      placeholder="Contact Number"
                    />
                    <Error errorName={errors.contact} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                    {t("FooterEmail")}
                  </label>
                  <div className=" sm:col-span-3">
                    <InputAreaTwo
                      required={true}
                      register={register}
                      label="Email"
                      name="email"
                      type="text"
                      placeholder="Email"
                    />
                    <Error errorName={errors.email} />
                  </div>
                </div>
                {/* Sitemap Settings */}
                <hr className="my-4" />
                <div className="text-md font-semibold mb-3">
                  Sitemap Settings
                </div>

                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 mb-4">
                  <label className="block text-sm font-medium text-gray-600 sm:col-span-2">
                    Include Products
                  </label>
                  <div className="sm:col-span-3">
                    <SwitchToggle
                      id="sitemap-products"
                      processOption={sitemapOptions?.include_products}
                      handleProcess={(v) =>
                        setSitemapOptions({
                          ...sitemapOptions,
                          include_products: v,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 mb-4">
                  <label className="block text-sm font-medium text-gray-600 sm:col-span-2">
                    Include Categories
                  </label>
                  <div className="sm:col-span-3">
                    <SwitchToggle
                      id="sitemap-cats"
                      processOption={sitemapOptions?.include_categories}
                      handleProcess={(v) =>
                        setSitemapOptions({
                          ...sitemapOptions,
                          include_categories: v,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 mb-4">
                  <label className="block text-sm font-medium text-gray-600 sm:col-span-2">
                    Include Static Pages
                  </label>
                  <div className="sm:col-span-3">
                    <SwitchToggle
                      id="sitemap-pages"
                      processOption={sitemapOptions?.include_static_pages}
                      handleProcess={(v) =>
                        setSitemapOptions({
                          ...sitemapOptions,
                          include_static_pages: v,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 mb-4">
                  <label className="block text-sm font-medium text-gray-600 sm:col-span-2">
                    Include Blog Posts
                  </label>
                  <div className="sm:col-span-3">
                    <SwitchToggle
                      id="sitemap-blog"
                      processOption={sitemapOptions?.include_blog_posts}
                      handleProcess={(v) =>
                        setSitemapOptions({
                          ...sitemapOptions,
                          include_blog_posts: v,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 items-start sm:grid-cols-12 gap-3 mb-4">
                  <label className="block text-sm font-medium text-gray-600 sm:col-span-2">
                    Exclude Out Of Stock
                  </label>
                  <div className="sm:col-span-3">
                    <SwitchToggle
                      id="sitemap-oos"
                      processOption={sitemapOptions?.exclude_out_of_stock}
                      handleProcess={(v) =>
                        setSitemapOptions({
                          ...sitemapOptions,
                          exclude_out_of_stock: v,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-12 gap-3 mb-6">
                  <label className="block text-sm font-medium text-gray-600 sm:col-span-2">
                    Exclusion List (one URL or product ID per line)
                  </label>
                  <div className="sm:col-span-3">
                    <textarea
                      value={sitemapOptions?.exclusion_list || ""}
                      onChange={(e) =>
                        setSitemapOptions({
                          ...sitemapOptions,
                          exclusion_list: e.target.value,
                        })
                      }
                      className="w-full border rounded-md p-2 h-28 text-sm"
                      placeholder="/pages/thank-you\nproduct-12345"
                    />
                    <span className="text-xs text-gray-500">
                      Paste exact paths or product IDs to exclude from sitemap
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-12 gap-3 mb-6">
                  <label className="block text-sm font-medium text-gray-600 sm:col-span-2">
                    Sitemap URL
                  </label>
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <input
                      value={
                        sitemapUrl ||
                        `${typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}/sitemap.xml` : ""}`
                      }
                      onChange={(e) => setSitemapUrl(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                    <Button
                      size="small"
                      className={copied ? "bg-green-500 text-white" : ""}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          sitemapUrl ||
                            `${window.location.protocol}//${window.location.host}/sitemap.xml`,
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 3000);
                      }}
                    >
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 text-sm text-blue-600"
                    >
                      Open Google Search Console
                    </a>
                  </div>
                </div>
              </div>
            </SettingContainer>
          </form>
        </div>
      </AnimatedContent>
    </>
  );
};
export default Setting;
