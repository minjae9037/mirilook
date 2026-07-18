package com.mirilook.app;

import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

import java.io.OutputStream;

/**
 * 원격(mirilook.com) 웹뷰에서 사진을 갤러리에 저장할 수 있도록 네이티브 브리지를 노출한다.
 * 웹은 window.MirilookNative.saveImage(base64, fileName, mime) 를 호출한다.
 * (안드로이드 웹뷰는 navigator.share/<a download>로 blob 저장이 안 되기 때문에 필요.)
 */
public class MainActivity extends BridgeActivity {

    @Override
    public void onStart() {
        super.onStart();
        WebView webView = this.bridge != null ? this.bridge.getWebView() : null;
        if (webView != null) {
            // 같은 이름으로 다시 추가하면 교체되므로 중복 등록은 안전하다.
            webView.addJavascriptInterface(new MirilookNativeBridge(), "MirilookNative");
        }
    }

    public class MirilookNativeBridge {
        @JavascriptInterface
        public boolean saveImage(String base64Data, String fileName, String mimeType) {
            try {
                String data = base64Data == null ? "" : base64Data;
                int comma = data.indexOf(',');
                if (data.startsWith("data:") && comma >= 0) {
                    data = data.substring(comma + 1);
                }
                byte[] bytes = Base64.decode(data, Base64.DEFAULT);
                if (bytes.length == 0) {
                    return false;
                }

                String name = (fileName == null || fileName.trim().isEmpty())
                        ? ("mirilook-" + System.currentTimeMillis() + ".jpg")
                        : fileName;
                String mime = (mimeType == null || mimeType.trim().isEmpty())
                        ? "image/jpeg"
                        : mimeType;

                ContentValues values = new ContentValues();
                values.put(MediaStore.Images.Media.DISPLAY_NAME, name);
                values.put(MediaStore.Images.Media.MIME_TYPE, mime);

                Uri collection;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    values.put(
                            MediaStore.Images.Media.RELATIVE_PATH,
                            Environment.DIRECTORY_PICTURES + "/Mirilook");
                    values.put(MediaStore.Images.Media.IS_PENDING, 1);
                    collection = MediaStore.Images.Media.getContentUri(
                            MediaStore.VOLUME_EXTERNAL_PRIMARY);
                } else {
                    collection = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                }

                Uri uri = getContentResolver().insert(collection, values);
                if (uri == null) {
                    return false;
                }

                OutputStream out = getContentResolver().openOutputStream(uri);
                if (out == null) {
                    return false;
                }
                out.write(bytes);
                out.flush();
                out.close();

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    values.clear();
                    values.put(MediaStore.Images.Media.IS_PENDING, 0);
                    getContentResolver().update(uri, values, null, null);
                }
                return true;
            } catch (Exception error) {
                return false;
            }
        }
    }
}
