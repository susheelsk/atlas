package com.bounce.atlas.utils;

import com.bounce.atlas.pojo.*;
import com.bounce.utils.BounceUtils;
import com.google.common.collect.Maps;
import com.google.gson.Gson;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.Version;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class FreemarkerUtils {

    public static final int VERSION = 1;

    public static Gson gson = new Gson();

    public static String getContent(String filename) throws IOException{
        StringBuilder content = new StringBuilder();
        try {
            InputStream inputStream = FreemarkerUtils.class.getClassLoader().getResourceAsStream(filename);
            if (inputStream != null) {
                content.append(IOUtils.toString(inputStream));
            } else {
                throw new IOException("File not found");
            }
        } catch (Exception e) {
            BounceUtils.logError(e);
            e.printStackTrace();
        }
        return content.toString();
    }

    public static InputStream getContentAsStream(String filename) throws IOException {
        InputStream content = null;
        try {
            content = FreemarkerUtils.class.getClassLoader().getResourceAsStream(filename);
            if(content == null) {
                throw new IOException("Resource not found");
            }
        } catch (Exception e) {
            BounceUtils.logError(e);
            e.printStackTrace();
        }
        return content;
    }

    public static String getFreemarkerString(String filename, Map<String, Object> templateData) {
        StringBuilder content = new StringBuilder();

        try {
            Version version = new Version(2, 3, 20);
            Configuration cfg = new Configuration(version);
            cfg.setClassForTemplateLoading(FreemarkerUtils.class, "/");
            cfg.setIncompatibleImprovements(new Version(2, 3, 20));
            cfg.setDefaultEncoding("UTF-8");
            cfg.setLocale(Locale.US);

            StringWriter stringWriter = new StringWriter();

            Template template = cfg.getTemplate(filename);
            template.process(templateData, stringWriter);

            content.append(stringWriter.toString());
        } catch (Exception e) {
            BounceUtils.logError(e);
            e.printStackTrace();
        }

        return content.toString();
    }

    public static void addMarkersToFreemarkerObj(List<MarkerPojo> markers, Map<String, Object> data) {
        data.put("markers", data);
        data.put("markersString", gson.toJson(markers));
        data.put("panOut", "true");
    }

    public static void addFencesToFreemarkerObj(List<FencePojo> markers, Map<String, Object> data) {
        data.put("fences", data);
        data.put("fenceString", gson.toJson(markers));
        data.put("panOut", "true");
    }

    public static void addCirclesToFreemarkerObj(List<CirclePojo> markers, Map<String, Object> data) {
        data.put("circles", data);
        data.put("circleString", gson.toJson(markers));
        data.put("panOut", "true");
    }

    public static void addPathsToFreemarkerObj(List<PathPojo> markers, Map<String, Object> data) {
        data.put("paths", data);
        data.put("pathString", gson.toJson(markers));
        data.put("panOut", "true");
    }

    public static Map<String, Object> getDefaultFreemarkerObj(String page) {
        Map<String, Object> data = Maps.newHashMap();

        ConfigPojo config = getConfig();

        data.put("title", config.getTitle());
        data.put("page", page);
        data.put("favicon", config.getFavicon());
        data.put("logo", config.getLogo());

        return data;
    }

    public static ConfigPojo getConfig() {
        try {
            ConfigPojo configPojo = new Gson().fromJson(getContent("config.json"), ConfigPojo.class);
            return configPojo;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static ConfigPojo.Page getPage(String path) {
        ConfigPojo.Page page = null;
        for(ConfigPojo.Page item : getConfig().getTabs()) {
            if(item.getPages() != null && item.getPages().size() > 0) {
                for(ConfigPojo.Page subItem : item.getPages()) {
                    if(subItem.getPath().equals(path)) {
                        page = subItem;
                        page.setPageId(item.getTabName());
                    }
                }
            } else {
                if(item.getPath().equals(path)) {
                    page = item;
                    page.setPageId(page.getPage());
                }
            }
        }

        return page;
    }

}
