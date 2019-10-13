import SearchbarInfo from './SearchbarInfo';

export function getSelectedCourse() {
    return SearchbarInfo.getInstance().getSelectedCourse();
}

export function getToggles() {
    return SearchbarInfo.getInstance().getToggles();
}

export function addListener(listener) {
    return SearchbarInfo.getInstance().addListener(listener);
}

export function removeListener(listener) {
    return SearchbarInfo.getInstance().removeListener(listener);
}

export function setUserInformation(courseList, requiredCourses) {
    return SearchbarInfo.getInstance().setUserInformation(courseList, requiredCourses);
}
