import { CourseElement, QuarterList} from './QuarterList';

export function getQuarterList(scheduleInformation, academicInformation) {
    var qList = new QuarterList();
    qList.populate(scheduleInformation, academicInformation);
    qList.populatePrerequisiteStatus();
    return qList;
}

/*
    Wraps course information in a courseElement wrapper
*/
export function wrapCourse(courseInformation) {
    return new CourseElement(courseInformation);
}
