import {Injectable} from "@angular/core";

@Injectable()
export class RandomUtils{


  public getFlagLinkForLanguage(userPrefferedLanguage: String): String {
    let countryForLanguage: String = 'us';

    switch (userPrefferedLanguage.toLowerCase()) {
      case "en":
        countryForLanguage = 'us';
        break;
      case "en-gb":
        countryForLanguage = 'gb';
        break;
      case "ja":
        countryForLanguage = 'jp';
        break;
      case "zh-tw":
        countryForLanguage = 'tw';
        break;
      case "ko":
        countryForLanguage = 'kr';
        break;
      case "cs":
        countryForLanguage = 'cz';
        break;
      case "und":
        countryForLanguage = 'us';
        break;

      default:
        countryForLanguage = userPrefferedLanguage;
    }

    return "https://www.countryflags.io/" + countryForLanguage + "/shiny/32.png";
  }

  public getIconClassForSource(sourceString: String): String {
    let sourceIconClass;

    switch (sourceString.toLowerCase()) {
      case "instagram":
        sourceIconClass = 'ion-social-instagram';
        break;
      case "foursquare":
        sourceIconClass = 'ion-social-foursquare';
        break;

      case "android":
        sourceIconClass = 'ion-social-android-outline';
        break;

      case "ios":
        sourceIconClass = 'ion-social-apple-outline';
        break;

      default:
        sourceIconClass = 'ion-android-globe'
    }


    return sourceIconClass;
  }
}
