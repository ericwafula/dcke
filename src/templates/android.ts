// A minimal single-module Jetpack Compose app.
// Versions track thamani-android so the template builds with the same toolchain.

export type AndroidOptions = { name: string; packageName: string }

// Files copied verbatim from templates/android (binary or executable).
export const ANDROID_STATIC_FILES = ['gradlew', 'gradlew.bat', 'gradle/wrapper/gradle-wrapper.jar']

export function androidFiles({ name, packageName }: AndroidOptions): Record<string, string> {
  const packagePath = packageName.replaceAll('.', '/')

  return {
    '.gitignore': ['*.iml', '.gradle/', '/local.properties', '.idea/', '.DS_Store', 'build/', '.kotlin/', ''].join('\n'),

    'gradle/wrapper/gradle-wrapper.properties': `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-9.5.1-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`,

    'gradle.properties': `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
`,

    'gradle/libs.versions.toml': `[versions]
agp = "9.2.1"
kotlin = "2.4.0"
sdk-compile = "37"
sdk-min = "28"
sdk-target = "36"
androidx-core-ktx = "1.19.0"
androidx-activity-compose = "1.13.0"
compose-bom = "2026.06.01"

[libraries]
androidx-core-ktx = { module = "androidx.core:core-ktx", version.ref = "androidx-core-ktx" }
androidx-activity-compose = { module = "androidx.activity:activity-compose", version.ref = "androidx-activity-compose" }
compose-bom = { module = "androidx.compose:compose-bom", version.ref = "compose-bom" }
compose-ui = { module = "androidx.compose.ui:ui" }
compose-ui-tooling = { module = "androidx.compose.ui:ui-tooling" }
compose-ui-tooling-preview = { module = "androidx.compose.ui:ui-tooling-preview" }
compose-material3 = { module = "androidx.compose.material3:material3" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`,

    'settings.gradle.kts': `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "${name}"
include(":app")
`,

    // AGP 9 provides built-in Kotlin, so the standalone kotlin-android plugin is not applied.
    'build.gradle.kts': `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.compose.compiler) apply false
}
`,

    'app/build.gradle.kts': `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose.compiler)
}

android {
    namespace = "${packageName}"
    compileSdk = libs.versions.sdk.compile.get().toInt()

    defaultConfig {
        applicationId = "${packageName}"
        minSdk = libs.versions.sdk.min.get().toInt()
        targetSdk = libs.versions.sdk.target.get().toInt()
        versionCode = 1
        versionName = "0.1.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.compose.bom))
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.tooling.preview)
    implementation(libs.compose.material3)
    debugImplementation(libs.compose.ui.tooling)
}
`,

    'app/src/main/AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:label="${name}"
        android:theme="@android:style/Theme.Material.Light.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,

    [`app/src/main/kotlin/${packagePath}/MainActivity.kt`]: `package ${packageName}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    Greeting()
                }
            }
        }
    }
}

@Composable
fun Greeting(modifier: Modifier = Modifier) {
    Box(modifier = modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Hello from ${name}")
    }
}

@Preview
@Composable
private fun GreetingPreview() {
    MaterialTheme { Greeting() }
}
`,
  }
}
