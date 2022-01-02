import {onLoad} from './utils';
import {present} from './presentation';

onLoad(() => {
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const shouldPresent = urlParams.get("present") != null;
    if (shouldPresent) {
        present();
    }
});
