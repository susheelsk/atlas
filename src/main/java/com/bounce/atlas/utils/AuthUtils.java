package com.bounce.atlas.utils;

import com.nimbusds.jose.JWSObject;
import org.apache.http.util.TextUtils;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class AuthUtils {

    public static boolean isAuth(String token) {
        try {
            if(!Utils.isAuthEnabled()) {
                return true;
            }
            if(!TextUtils.isEmpty(token)) {
                JWSObject jwsObject = JWSObject.parse(token);
                JSONObject jsonObject = new JSONObject(jwsObject.getPayload().toJSONObject().toJSONString());
                String domain = jsonObject.optString("hd");
                String email_verified = jsonObject.optString("email_verified");
                String email = jsonObject.optString("email");
                if (!TextUtils.isEmpty(getDomain()) && domain.equals(getDomain()) && email_verified.equals("true")) {
                    return true;
                }
                Map<String, List<String>> authRoleMap = ContentUtils.getConfig().getAuthRoles();
                for(Map.Entry<String, List<String>> entry : authRoleMap.entrySet()) {
                    for(String authEmail : entry.getValue()) {
                        if(email.equals(authEmail)) {
                            return true;
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public static String getUserId(String token) {
        try {
            if(!TextUtils.isEmpty(token)) {
                JWSObject jwsObject = JWSObject.parse(token);
                JSONObject jsonObject = new JSONObject(jwsObject.getPayload().toJSONObject().toJSONString());
                String domain = jsonObject.optString("hd");
                String email_verified = jsonObject.optString("email_verified");
                String email = jsonObject.optString("email");
                return email;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String getDomain(String token) {
        try {
            if(!TextUtils.isEmpty(token)) {
                JWSObject jwsObject = JWSObject.parse(token);
                JSONObject jsonObject = new JSONObject(jwsObject.getPayload().toJSONObject().toJSONString());
                String domain = jsonObject.optString("hd");
                String email_verified = jsonObject.optString("email_verified");
                return domain;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static boolean isAdmin(String userId) {
        if(TextUtils.isEmpty(userId)) {
            return false;
        }
        List<String> authRoleUserIds =  ContentUtils.getConfig().getAuthRoles().get("admin");
        if(authRoleUserIds != null && authRoleUserIds.contains(userId)) {
            return true;
        }
        return false;
    }

    public static String getDomain() {
        return PropertiesLoader.getProperty("googleauth.domain");
    }

}
