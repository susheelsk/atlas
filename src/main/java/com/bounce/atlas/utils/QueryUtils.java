package com.bounce.atlas.utils;

import com.bounce.atlas.pojo.MarkerPojo;
import com.bounce.utils.BounceUtils;
import com.bounce.utils.DatabaseConnector;
import com.bounce.utils.dbmodels.public_.enums.BikeStatus;
import com.bounce.utils.dbmodels.public_.tables.Bike;
import com.bounce.utils.dbmodels.public_.tables.records.BikeRecord;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.http.util.TextUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class QueryUtils {

    public static List<BikeRecord> getBikes(double lat, double lon, int limit, int radius) {
        try {
            String sql = "SELECT  * FROM bike WHERE ST_DWithin(CAST(ST_MakePoint(bike.lon, bike.lat) AS geography(GEOMETRY,-1)), " +
                    "CAST(ST_MakePoint(" + lon + "," + lat + ") AS geography(GEOMETRY,-1)), " + radius +") " +
                    "limit " + limit;

            List<BikeRecord> bikes = DatabaseConnector.getDb().getReadDbConnector().fetch(sql).into(Bike.BIKE);
            return bikes;
        } catch (Exception e) {
            e.printStackTrace();
            BounceUtils.logError(e);
        }
        return Lists.newArrayList();
    }

    public static List<BikeRecord> getBikes(String searchQuery) {
        try {
            boolean isBikeId = false;
            if (!TextUtils.isEmpty(searchQuery)) {
                try {
                    int num = Integer.parseInt(searchQuery);
                    if (num > 9999) {
                        isBikeId = true;
                    }
                } catch (NumberFormatException e) {
                }
            }
            List<BikeRecord> bikes;
            if (isBikeId) {
                bikes = DatabaseConnector.getDb().getReadDbConnector().selectFrom(Bike.BIKE)
                        .where(Bike.BIKE.ID.eq(Integer.parseInt(searchQuery))).fetch();
            } else {
                bikes = DatabaseConnector.getDb().getReadDbConnector().selectFrom(Bike.BIKE)
                        .where(Bike.BIKE.LICENSE_PLATE.contains(searchQuery)).fetch();
            }
            return bikes;
        } catch (Exception e) {
            e.printStackTrace();
            BounceUtils.logError(e);
        }
        return Lists.newArrayList();
    }

    public static List<MarkerPojo> getBikesAsMarkers(List<BikeRecord> bikes) {
        List<MarkerPojo> markers = new ArrayList<>();
        try {
            for (BikeRecord bike : bikes) {
                MarkerPojo marker = new MarkerPojo();
                switch (bike.getStatus()) {
                    case idle:
                        marker.iconUrl = "/resources/icons/marker_green.png";
                        break;
                    case busy:
                        marker.iconUrl = "/resources/icons/marker_yello.png";
                        break;
                    case oos:
                        marker.iconUrl = "/resources/icons/marker_red.png";
                        break;
                    default:
                        marker.iconUrl = "/resources/icons/marker_red.png";
                        break;
                }
                marker.cta = "/bikes/" + bike.getId();
                marker.title = "" + bike.getId();
                marker.subtext = bike.getLicensePlate();
                marker.lat = bike.getLat();
                marker.lon = bike.getLon();

                Map<String, Object> bikeData = bike.intoMap();

                marker.data = Maps.newHashMap();
                marker.data.put("location", (bikeData.get("lat")+ "," + bikeData.get("lon")));
                marker.data.put("loc_updated_time", bikeData.get("loc_updated_time"));
                marker.data.put("type", bikeData.get("type"));
                marker.data.put("active", bikeData.get("active"));
                marker.data.put("is_live", bikeData.get("is_live"));
                marker.data.put("geo_id", bikeData.get("geo_id"));
                marker.data.put("axcess_id", bikeData.get("axcess_id"));
                marker.data.put("secondary_gps", (bikeData.get("sec_gps_lat")+ "," + bikeData.get("sec_gps_lon")));
                marker.data.put("sec_gps_updated_time", bikeData.get("sec_gps_updated_time"));
                marker.data.put("is_live_reason", bikeData.get("is_live_reason"));
                marker.data.put("is_live_update_loc", bikeData.get("is_live_update_loc"));

                markers.add(marker);
            }
        } catch (Exception e) {
            e.printStackTrace();
            BounceUtils.logError(e);
        }

        return markers;
    }

}
